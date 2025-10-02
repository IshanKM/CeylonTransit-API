// src/routers/locations.js
import { Router } from 'express';
import LocationService from '../services/LocationService.js';
import Trip from '../models/Trip.js';
import Bus from '../models/Bus.js';
import { requireApiKey } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/v1/locations
 * Body: { busId, tripId, timestamp, coordinates: [lng,lat], speed, heading }
 * Protected (API key) — from simulator/operator.
 */
router.post('/', requireApiKey, async (req, res) => {
  try {
    const { busId, tripId, timestamp, coordinates, speed, heading } = req.body;
    if (!busId || !coordinates) return res.status(400).json({ success: false, message: 'busId and coordinates required' });

    // find bus and trip (optional)
    const bus = await Bus.findOne({ busId });
    let trip = null;
    let route = null;
    if (tripId) {
      trip = await Trip.findOne({ tripId });
      if (trip) route = trip.route;
    }

    const payload = {
      bus: bus ? bus._id : null,
      trip: trip ? trip._id : null,
      route: route ? route : null,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      location: { type: 'Point', coordinates },
      speed,
      heading
    };

    // if bus wasn't in DB, create a minimal record
    let savedBus = bus;
    if (!bus) {
      savedBus = await Bus.create({ busId, operator: 'unknown' });
      payload.bus = savedBus._id;
    }

    const loc = await LocationService.create(payload);

    // optionally set bus.currentTrip if present
    if (trip && savedBus) {
      await Bus.findByIdAndUpdate(savedBus._id, { currentTrip: trip._id });
    }

    res.status(201).json({ success: true, data: loc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET live locations for a route (latest per bus)
router.get('/live', async (req, res) => {
  try {
    const { routeId } = req.query;
    if (!routeId) return res.status(400).json({ success: false, message: 'routeId required' });

    // try to find route by routeId (human id)
    const Route = (await import('../models/Route.js')).default;
    const route = await Route.findOne({ routeId });
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });

    const latest = await LocationService.getLatestByRoute(route._id);
    res.json({ success: true, data: latest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET history for a trip
router.get('/history', async (req, res) => {
  const { tripId } = req.query;
  if (!tripId) return res.status(400).json({ success: false, message: 'tripId required' });
  const Trip = (await import('../models/Trip.js')).default;
  const trip = await Trip.findOne({ tripId });
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  const history = await LocationService.getHistoryByTrip(trip._id);
  res.json({ success: true, data: history });
});

export default router;
