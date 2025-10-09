// src/services/PositionService.js
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import Schedule from '../models/Schedule.js';
import Position from '../models/Position.js';
import { distanceMeters, bearing, interpolate } from '../helpers/geo.js';

const STOP_RADIUS_METERS = parseInt(process.env.STOP_RADIUS_METERS || '50', 10);

// helper: find nearest stop and its index
function findNearestStop(stops, coords) {
  if (!stops || stops.length === 0) return null;
  let best = null;
  for (let i = 0; i < stops.length; i++) {
    const s = stops[i];
    const d = distanceMeters(s.coordinates, coords);
    if (!best || d < best.distance) best = { stop: s, index: i, distance: d };
  }
  return best; // { stop, index, distance (meters) }
}

// helper: estimate km-from-start for a bus coordinate
function estimateKmFromStart(stops, coords) {
  // find nearest stop index
  const nearest = findNearestStop(stops, coords);
  if (!nearest) return 0;
  const idx = nearest.index;
  if (idx < stops.length - 1) {
    const A = stops[idx];
    const B = stops[idx + 1];
    const distAtoBus = distanceMeters(A.coordinates, coords) / 1000.0; // km
    const distAtoB = distanceMeters(A.coordinates, B.coordinates) / 1000.0;
    const frac = distAtoB === 0 ? 0 : Math.min(1, distAtoBus / distAtoB);
    return A.distanceFromStartKm + frac * (B.distanceFromStartKm - A.distanceFromStartKm);
  } else if (idx > 0) {
    // if nearest is last stop, interpolate with previous
    const A = stops[idx - 1];
    const B = stops[idx];
    const distAtoBus = distanceMeters(A.coordinates, coords) / 1000.0;
    const distAtoB = distanceMeters(A.coordinates, B.coordinates) / 1000.0;
    const frac = distAtoB === 0 ? 1 : Math.min(1, distAtoBus / distAtoB);
    return A.distanceFromStartKm + frac * (B.distanceFromStartKm - A.distanceFromStartKm);
  } else {
    // only one stop or index 0
    return stops[0].distanceFromStartKm;
  }
}

// helper: find next stop index based on direction
function findNextStopIndex(stops, kmFromStart, direction = 'forward') {
  if (direction === 'forward') {
    for (let i = 0; i < stops.length; i++) {
      if (stops[i].distanceFromStartKm > kmFromStart + 0.0001) return i;
    }
    return stops.length - 1;
  } else {
    // backward: find last stop whose distance < kmFromStart
    for (let i = stops.length - 1; i >= 0; i--) {
      if (stops[i].distanceFromStartKm < kmFromStart - 0.0001) return i;
    }
    return 0;
  }
}

class PositionService {
  /**
   * Receive a single report (simple names).
   * report = {
   *   deviceId, busId, registration, operator,
   *   time, coordinates: [lng,lat], speed, heading, battery, temperature, status
   * }
   */
  static async receive(report) {
    const {
      deviceId,
      busId,
      registration,
      operator,
      time,
      coordinates,
      speed,
      heading,
      battery,
      temperature,
      status
    } = report;

    if (!busId || !Array.isArray(coordinates) || coordinates.length !== 2) {
      throw new Error('busId and coordinates [lng,lat] are required');
    }

    // 1) find bus (create if not exists)
    let bus = await Bus.findOne({ busId });
    if (!bus) {
      // create minimal bus record if missing (admin can update later)
      bus = await Bus.create({
        busId,
        registration: registration || '',
        operator: operator || '',
        deviceId: deviceId || null
      });
    } else {
      // update meta fields if provided
      const update = {};
      if (deviceId && bus.deviceId !== deviceId) update.deviceId = deviceId;
      if (registration && bus.registration !== registration) update.registration = registration;
      if (operator && bus.operator !== operator) update.operator = operator;
      if (Object.keys(update).length) await Bus.findByIdAndUpdate(bus._id, update);
    }

    // 2) find active schedule (if any) for this bus now
    const now = time ? new Date(time) : new Date();
    const ScheduleModel = await Schedule.findOne({
      bus: bus._id,
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).populate('route').exec();

    // route to use:
    let route = null;
    if (ScheduleModel) route = ScheduleModel.route;
    else if (bus.route) route = await Route.findById(bus.route).lean();

    // 3) compute nearest stop and km-from-start
    let nearestStop = null;
    let kmFromStart = 0;
    if (route && route.stops && route.stops.length > 0) {
      const nearest = findNearestStop(route.stops, coordinates);
      if (nearest) {
        nearestStop = {
          stopId: nearest.stop.stopId,
          stopName: nearest.stop.name,
          distanceMeters: Math.round(nearest.distance)
        };
      }
      kmFromStart = estimateKmFromStart(route.stops, coordinates);
    }

    // 4) determine direction: from schedule if exists else default forward
    let direction = 'forward';
    if (ScheduleModel && ScheduleModel.direction) direction = ScheduleModel.direction;

    // 5) find next stop index and compute distances
    let etaToNextStopMin = null;
    let etaToEndMin = null;
    if (route) {
      const totalKm = route.distanceKm || (route.stops.length ? route.stops[route.stops.length - 1].distanceFromStartKm : 0);
      const nextIndex = findNextStopIndex(route.stops, kmFromStart, direction);
      let nextStopKm = route.stops[nextIndex].distanceFromStartKm;
      // if backward direction, remaining = kmFromStart - nextStopKm
      let remainingKmToNext = direction === 'forward' ? Math.max(0, nextStopKm - kmFromStart) : Math.max(0, kmFromStart - nextStopKm);
      // ETA based on speed
      const speedKmph = (speed && speed > 0) ? speed : route.averageSpeedKmph || 40;
      if (speedKmph && speedKmph > 1) {
        etaToNextStopMin = Math.round((remainingKmToNext / speedKmph) * 60);
      } else {
        etaToNextStopMin = Math.round((remainingKmToNext / (route.averageSpeedKmph || 40)) * 60);
      }
      // ETA to end
      const remainingKmToEnd = direction === 'forward' ? Math.max(0, totalKm - kmFromStart) : Math.max(0, kmFromStart);
      if (speedKmph && speedKmph > 1) {
        etaToEndMin = Math.round((remainingKmToEnd / speedKmph) * 60);
      } else {
        etaToEndMin = Math.round((remainingKmToEnd / (route.averageSpeedKmph || 40)) * 60);
      }
    }

    // 6) save Position record
    const pos = await Position.create({
      bus: bus._id,
      schedule: ScheduleModel ? ScheduleModel._id : null,
      route: route ? route._id : null,
      time: now,
      coordinates: { type: 'Point', coordinates },
      speed,
      heading,
      battery,
      temperature,
      status,
      nearestStop,
      kmFromStart,
      etaToNextStopMin,
      etaToEndMin
    });

    // 7) update bus.latest summary and set bus.currentSchedule
    const latest = {
      time: now,
      coordinates,
      speed,
      heading,
      battery,
      temperature,
      status,
      nearestStop,
      kmFromStart,
      etaToNextStopMin,
      etaToEndMin
    };

    const busUpdate = { latest };
    if (ScheduleModel) {
      busUpdate.currentSchedule = ScheduleModel._id;
      if (ScheduleModel.status === 'scheduled') {
        // first ping for scheduled trip -> mark running
        await Schedule.findByIdAndUpdate(ScheduleModel._id, { status: 'running', actualStart: now });
      }
      busUpdate.status = 'in_service';
    }

    await Bus.findByIdAndUpdate(bus._id, busUpdate);

    // 8) if schedule exists and we matched final stop -> complete schedule
    if (ScheduleModel && route && nearestStop) {
      const lastIndex = route.stops.length - 1;
      const matchedIndex = route.stops.findIndex(s => s.stopId === nearestStop.stopId);
      if (matchedIndex === lastIndex) {
        // mark schedule completed
        await Schedule.findByIdAndUpdate(ScheduleModel._id, { status: 'completed', actualEnd: now });
        await Bus.findByIdAndUpdate(bus._id, { currentSchedule: null, status: 'idle' });
      }
    }

    return pos;
  }

  // get latest positions for a route
  static async liveForRoute(routeIdString) {
    const route = await Route.findOne({ routeId: routeIdString });
    if (!route) return [];
    const pipeline = [
      { $match: { route: route._id } },
      { $sort: { time: -1 } },
      { $group: {
          _id: '$bus',
          bus: { $first: '$bus' },
          time: { $first: '$time' },
          coordinates: { $first: '$coordinates' },
          speed: { $first: '$speed' },
          heading: { $first: '$heading' },
          nearestStop: { $first: '$nearestStop' },
          etaToNextStopMin: { $first: '$etaToNextStopMin' },
          etaToEndMin: { $first: '$etaToEndMin' }
      }},
      { $lookup: { from: 'buses', localField: 'bus', foreignField: '_id', as: 'busInfo' } },
      { $unwind: { path: '$busInfo', preserveNullAndEmptyArrays: true } },
      { $project: {
          _id: 0,
          busId: '$busInfo.busId',
          registration: '$busInfo.registration',
          operator: '$busInfo.operator',
          time: 1,
          coordinates: 1,
          speed:1,
          heading:1,
          nearestStop:1,
          etaToNextStopMin:1,
          etaToEndMin:1
      }}
    ];
    return Position.aggregate(pipeline);
  }

  // get full history for a schedule
  static async historyForSchedule(scheduleId) {
    const sch = await Schedule.findOne({ scheduleId });
    if (!sch) return [];
    return Position.find({ schedule: sch._id }).sort({ time: 1 }).lean();
  }
}

export default PositionService;
