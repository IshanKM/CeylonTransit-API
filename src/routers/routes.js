// src/routers/routes.js
import { Router } from 'express';
import RouteService from '../services/RouteService.js';

const router = Router();

// create route
router.post('/', async (req, res) => {
  try {
    const r = await RouteService.create(req.body);
    res.status(201).json({ success: true, data: r });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// list routes
router.get('/', async (req, res) => {
  const list = await RouteService.list();
  res.json({ success: true, data: list });
});

// get by id or routeId
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  let route = await RouteService.findById(id);
  if (!route) route = await RouteService.findByRouteId(id);
  if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
  res.json({ success: true, data: route });
});

export default router;
