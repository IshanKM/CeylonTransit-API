// src/controllers/locationsController.js
import { Router } from 'express';
import { requireApiKey } from '../middleware/auth.js';
import LocationService from '../services/LocationService.js';

const router = Router();

/**
 * POST /api/v1/locations
 * body: single object OR array of objects
 * header: x-api-key
 */
router.post('/', requireApiKey, async (req, res) => {
  const payload = req.body;
  try {
    if (Array.isArray(payload)) {
      const results = [];
      for (const item of payload) {
        try {
          const r = await LocationService.receive(item);
          results.push({ success: true, id: r._id });
        } catch (err) {
          results.push({ success: false, message: err.message });
        }
      }
      return res.status(201).json({ success: true, results });
    } else {
      const loc = await LocationService.receive(payload);
      return res.status(201).json({ success: true, data: loc });
    }
  } catch (err) {
    console.error('locations post error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET latest per route: /api/v1/locations/live?routeId=R001
router.get('/live', async (req, res) => {
  const { routeId } = req.query;
  if (!routeId) return res.status(400).json({ success: false, message: 'routeId required' });
  const latest = await LocationService.getLatestByRoute(routeId);
  res.json({ success: true, data: latest });
});

// GET history for trip: /api/v1/locations/history?tripId=TRIP-...
router.get('/history', async (req, res) => {
  const { tripId } = req.query;
  if (!tripId) return res.status(400).json({ success: false, message: 'tripId required' });
  const hist = await LocationService.getHistoryByTrip(tripId);
  res.json({ success: true, data: hist });
});

export default router;
