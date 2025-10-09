import { Router } from 'express';
import TripService from '../services/TripService.js';
import { requireApiKey } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Manage bus trips
 */

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Create a new trip
 *     description: Creates a new trip (operator only, requires API key).
 *     tags: [Trips]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripInput'
 *     responses:
 *       201:
 *         description: Trip created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TripResponse'
 *       400:
 *         description: Invalid input
 */
router.post('/', requireApiKey, async (req, res) => {
  try {
    const trip = await TripService.create(req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/trips/{id}/status:
 *   put:
 *     summary: Update trip status
 *     description: Updates the status of a trip (operator only, requires API key).
 *     tags: [Trips]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the trip (e.g., "ongoing", "completed")
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Trip status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TripResponse'
 *       400:
 *         description: Invalid input
 */
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

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: List trips by route
 *     description: Retrieves all trips for a specific route.
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the route
 *     responses:
 *       200:
 *         description: List of trips for the route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TripInput'
 *       400:
 *         description: Missing routeId query
 */
router.get('/', async (req, res) => {
  const { routeId } = req.query;
  if (!routeId) return res.status(400).json({ success: false, message: 'routeId query required' });
  const trips = await TripService.listByRoute(routeId);
  res.json({ success: true, data: trips });
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     TripInput:
 *       type: object
 *       required:
 *         - busId
 *         - routeId
 *         - departureTime
 *       properties:
 *         busId:
 *           type: string
 *           description: ID of the bus
 *         routeId:
 *           type: string
 *           description: ID of the route
 *         departureTime:
 *           type: string
 *           format: date-time
 *           description: Trip departure time
 *         status:
 *           type: string
 *           description: Status of the trip
 *       example:
 *         busId: "650f123456abcdef12345678"
 *         routeId: "650f87654321fedcba987654"
 *         departureTime: "2025-10-09T08:30:00Z"
 *         status: "scheduled"
 *
 *     TripResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/TripInput'
 *
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 */
