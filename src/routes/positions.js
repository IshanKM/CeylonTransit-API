import express from 'express';
import {
  createPosition,
  getLastPosition,
  getBusPositions
} from '../controllers/positionController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Positions
 *   description: Manage and view GPS position data for buses
 */

/**
 * @swagger
 * /api/positions:
 *   post:
 *     summary: Create a new GPS position entry
 *     description: Stores the latest GPS data from a bus (requires authentication).
 *     tags: [Positions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PositionInput'
 *     responses:
 *       201:
 *         description: Position created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PositionResponse'
 *       400:
 *         description: Invalid data or missing required fields
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, createPosition);

/**
 * @swagger
 * /api/positions/last/{busId}:
 *   get:
 *     summary: Get the last known position of a bus
 *     description: Retrieves the latest GPS record for the specified bus.
 *     tags: [Positions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: busId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bus
 *     responses:
 *       200:
 *         description: Latest position found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PositionResponse'
 *       404:
 *         description: No position data found for this bus
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get('/last/:busId', verifyToken, getLastPosition);

/**
 * @swagger
 * /api/positions/{busId}:
 *   get:
 *     summary: Get full GPS history for a bus
 *     description: Retrieves all stored GPS positions for the specified bus.
 *     tags: [Positions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: busId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bus
 *     responses:
 *       200:
 *         description: List of all GPS positions for the bus
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PositionListResponse'
 *       404:
 *         description: No position data found for this bus
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get('/:busId', verifyToken, getBusPositions);

export default router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     PositionInput:
 *       type: object
 *       required:
 *         - busId
 *         - latitude
 *         - longitude
 *         - timestamp
 *       properties:
 *         busId:
 *           type: string
 *           description: The ID of the bus
 *         latitude:
 *           type: number
 *           format: float
 *           description: Current latitude
 *         longitude:
 *           type: number
 *           format: float
 *           description: Current longitude
 *         speed:
 *           type: number
 *           format: float
 *           description: Bus speed in km/h
 *         direction:
 *           type: string
 *           description: Direction of travel (e.g., N, S, E, W)
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Time of the GPS record
 *       example:
 *         busId: "671f7b9df2a67e001f63ab8b"
 *         latitude: 6.9271
 *         longitude: 79.8612
 *         speed: 50.5
 *         direction: "NE"
 *         timestamp: "2025-10-09T05:30:00Z"
 *
 *     PositionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/PositionInput'
 *
 *     PositionListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PositionInput'
 */
