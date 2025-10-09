import express from 'express';
import {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
} from '../controllers/scheduleController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Manage bus schedules
 */

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get all schedules
 *     description: Retrieves a list of all bus schedules.
 *     tags: [Schedules]
 *     responses:
 *       200:
 *         description: List of schedules successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleListResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllSchedules);

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Get schedule by ID
 *     description: Retrieves detailed information about a specific schedule by its ID.
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the schedule
 *     responses:
 *       200:
 *         description: Schedule details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleResponse'
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getScheduleById);

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create a new schedule
 *     description: Add a new bus schedule (Admin only).
 *     tags: [Schedules]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleInput'
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — only admins can create schedules
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, isAdmin, createSchedule);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Update a schedule
 *     description: Update schedule details (Admin only).
 *     tags: [Schedules]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the schedule to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleInput'
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — only admins can update schedules
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', verifyToken, isAdmin, updateSchedule);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Delete a schedule
 *     description: Delete a specific schedule by ID (Admin only).
 *     tags: [Schedules]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the schedule to delete
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — only admins can delete schedules
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', verifyToken, isAdmin, deleteSchedule);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ScheduleInput:
 *       type: object
 *       required:
 *         - busId
 *         - routeId
 *         - departureTime
 *         - arrivalTime
 *       properties:
 *         busId:
 *           type: string
 *           description: ID of the bus assigned
 *         routeId:
 *           type: string
 *           description: ID of the route
 *         departureTime:
 *           type: string
 *           format: date-time
 *           description: Departure time of the bus
 *         arrivalTime:
 *           type: string
 *           format: date-time
 *           description: Arrival time of the bus
 *       example:
 *         busId: "650f123456abcdef12345678"
 *         routeId: "650f87654321fedcba987654"
 *         departureTime: "2025-10-09T08:30:00Z"
 *         arrivalTime: "2025-10-09T12:45:00Z"
 *
 *     ScheduleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/ScheduleInput'
 *
 *     ScheduleListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ScheduleInput'
 */
