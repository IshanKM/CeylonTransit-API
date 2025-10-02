// src/routers/trips.js
import { Router } from 'express';
import TripService from '../services/TripService.js';
import { requireApiKey } from '../middleware/auth.js';

const router = Router();

// create trip (operator only)
router.post('/', requireApiKey, async (req, res) => {
  try {
    const trip = await TripService.create(req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// update status
router.put('/:id/status', requireApiKey, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await TripService.updateStatus(id, status);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// list trips by route query
router.get('/', async (req, res) => {
  const { routeId } = req.query;
  if (!routeId) return res.status(400).json({ success: false, message: 'routeId query required' });
  const trips = await TripService.listByRoute(routeId);
  res.json({ success: true, data: trips });
});

export default router;
