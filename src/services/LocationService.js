// src/services/LocationService.js
import Bus from "../models/Bus.js";
import Trip from "../models/Trip.js";
import Route from "../models/Route.js";
import Location from "../models/Location.js";
import { findNearestStop } from "../helpers/geo.js";

const STOP_RADIUS = parseInt(process.env.STOP_RADIUS_METERS || "50", 10);

class LocationService {
  static async receive(data) {
    const {
      deviceId,
      busId,
      registration,
      operator,
      tripId,
      timestamp,
      coordinates,
      speed,
      heading,
      battery,
      temperature,
      status,
    } = data;

    console.log("========================================");
    console.log("🚌  New bus data received");
    console.log("➡️  Bus ID:", busId);
    console.log("📍  Coordinates:", coordinates);
    console.log("🕒  Time:", timestamp);
    console.log("⚡  Speed:", speed, "km/h | Temp:", temperature, "°C");

    if (!busId || !Array.isArray(coordinates) || coordinates.length !== 2) {
      console.log("❌ Invalid data received. Missing busId or coordinates.");
      throw new Error("busId and coordinates [lng,lat] are required");
    }

    // find or create bus
    let bus = await Bus.findOne({ busId });
    if (!bus) {
      console.log("ℹ️  Bus not found in DB. Creating new bus record...");
      bus = await Bus.create({
        busId,
        registration: registration || "",
        operator: operator || "unknown",
        deviceId: deviceId || null,
      });
    } else {
      const upd = {};
      if (deviceId && bus.deviceId !== deviceId) upd.deviceId = deviceId;
      if (registration && bus.registration !== registration)
        upd.registration = registration;
      if (operator && bus.operator !== operator) upd.operator = operator;
      if (Object.keys(upd).length) {
        console.log("🔄  Updating bus details in DB...");
        await Bus.findByIdAndUpdate(bus._id, upd);
      }
    }

    // find trip & route
    let trip = null;
    let route = null;
    if (tripId) {
      trip = await Trip.findOne({ tripId });
      if (trip) {
        route = await Route.findById(trip.route).lean();
        console.log("🗺️  Matched trip & route for this bus.");
      }
    }

    // stop matching
    let stopMatched = null;
    if (route && route.stops && route.stops.length > 0) {
      const match = findNearestStop(route.stops, coordinates, STOP_RADIUS);
      if (match) {
        stopMatched = {
          stopId: match.stop.stopId,
          stopName: match.stop.name,
          distance: Math.round(match.distance),
        };
        console.log("📍  Near stop:", stopMatched.stopName);
      }
    }

    // save new location record
    const loc = await Location.create({
      bus: bus._id,
      trip: trip ? trip._id : null,
      route: route ? route._id : null,
      deviceId: deviceId || null,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      location: { type: "Point", coordinates },
      speed,
      heading,
      battery,
      temperature,
      status,
      stopMatched,
    });

    console.log("💾  Location data saved in MongoDB →", loc._id);

    // update bus with latest info
    await Bus.findByIdAndUpdate(bus._id, {
      lastTelemetry: {
        timestamp: loc.timestamp,
        coordinates,
        speed,
        heading,
        battery,
        temperature,
        status,
        stopMatched,
      },
      currentTrip: trip ? trip._id : bus.currentTrip,
      status: trip && trip.status === "running" ? "in_service" : bus.status,
    });

    // mark trip as running
    if (trip && trip.status === "scheduled") {
      console.log("🟢  Trip started → marking as running...");
      await Trip.findByIdAndUpdate(trip._id, {
        status: "running",
        actualStart: loc.timestamp,
      });
    }

    // check if bus reached last stop
    if (trip && route && stopMatched) {
      const lastIndex = route.stops.length - 1;
      const matchedIndex = route.stops.findIndex(
        (s) => s.stopId === stopMatched.stopId
      );
      if (matchedIndex === lastIndex) {
        console.log("🏁  Trip completed → marking as finished...");
        await Trip.findByIdAndUpdate(trip._id, {
          status: "completed",
          actualEnd: loc.timestamp,
        });
        await Bus.findByIdAndUpdate(bus._id, {
          currentTrip: null,
          status: "idle",
        });
      }
    }

    console.log("✅  Processing finished for bus:", busId);
    console.log("========================================\n");

    return loc;
  }

  // get latest live data
  static async getLatestByRoute(routeId) {
    const route = await Route.findOne({ routeId });
    if (!route) return [];

    const pipeline = [
      { $match: { route: route._id } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$bus",
          bus: { $first: "$bus" },
          timestamp: { $first: "$timestamp" },
          location: { $first: "$location" },
          speed: { $first: "$speed" },
          heading: { $first: "$heading" },
          stopMatched: { $first: "$stopMatched" },
        },
      },
      {
        $lookup: {
          from: "buses",
          localField: "bus",
          foreignField: "_id",
          as: "busData",
        },
      },
      { $unwind: { path: "$busData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          busId: "$busData.busId",
          registration: "$busData.registration",
          timestamp: 1,
          location: 1,
          speed: 1,
          heading: 1,
          stopMatched: 1,
        },
      },
    ];
    return Location.aggregate(pipeline);
  }

  // get trip history
  static async getHistoryByTrip(tripId) {
    const trip = await Trip.findOne({ tripId });
    if (!trip) return [];
    return Location.find({ trip: trip._id }).sort({ timestamp: 1 }).lean();
  }
}

export default LocationService;
