// src/controllers/tripsController.js
import { Router } from 'express';
import TripService from '../services/TripService.js';
import { requireApiKey } from '../middleware/auth.js';

const router = Router();

router.get('/:tripId', async (req, res) => {
  const { tripId } = req.params;
  const trip = await TripService.findByTripId(tripId);
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  res.json({ success: true, data: trip });
});

// create trip (protected)
router.post('/', requireApiKey, async (req, res) => {
  try {
    const t = await TripService.create(req.body);
    res.status(201).json({ success: true, data: t });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:tripId/status', requireApiKey, async (req, res) => {
  const { tripId } = req.params;
  const upd = await TripService.updateStatus(tripId, req.body);
  res.json({ success: true, data: upd });
});

export default router;
