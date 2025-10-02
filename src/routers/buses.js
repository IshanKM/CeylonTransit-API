// src/routers/buses.js
import { Router } from 'express';
import BusService from '../services/BusService.js';
import LocationService from '../services/LocationService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const b = await BusService.create(req.body);
    res.status(201).json({ success: true, data: b });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  // try by _id then busId
  let bus = await BusService.getById(id);
  if (!bus) bus = await BusService.getByBusId(id);
  if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });

  const lastLocation = await LocationService.getLatestByBus(bus._id);
  res.json({ success: true, data: { bus, lastLocation } });
});

export default router;
