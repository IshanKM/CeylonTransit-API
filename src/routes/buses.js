import express from 'express';
import { createBus, getAllBuses, getBusById, updateBus, deleteBus } from '../controllers/busController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Buses
 *   description: API endpoints for managing buses
 */

/**
 * @swagger
 * /api/buses:
 *   get:
 *     summary: Get all buses
 *     tags: [Buses]
 *     responses:
 *       200:
 *         description: List of all buses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bus'
 */

/**
 * @swagger
 * /api/buses/{id}:
 *   get:
 *     summary: Get a bus by ID
 *     tags: [Buses]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the bus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bus found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bus'
 *       404:
 *         description: Bus not found
 */

/**
 * @swagger
 * /api/buses:
 *   post:
 *     summary: Create a new bus
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bus'
 *     responses:
 *       201:
 *         description: Bus created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/buses/{id}:
 *   put:
 *     summary: Update a bus
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the bus
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bus'
 *     responses:
 *       200:
 *         description: Bus updated successfully
 *       404:
 *         description: Bus not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/buses/{id}:
 *   delete:
 *     summary: Delete a bus
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the bus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bus deleted successfully
 *       404:
 *         description: Bus not found
 *       401:
 *         description: Unauthorized
 */

router.get('/', getAllBuses);
router.get('/:id', getBusById);
router.post('/', verifyToken, isAdmin, createBus);
router.put('/:id', verifyToken, isAdmin, updateBus);
router.delete('/:id', verifyToken, isAdmin, deleteBus);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Bus:
 *       type: object
 *       required:
 *         - busNumber
 *         - route
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the bus
 *         busNumber:
 *           type: string
 *           description: Unique number identifying the bus
 *         route:
 *           type: string
 *           description: Route assigned to the bus
 *         driverName:
 *           type: string
 *           description: Name of the driver
 *         capacity:
 *           type: integer
 *           description: Number of seats available
 *       example:
 *         _id: 671f7b9df2a67e001f63ab8b
 *         busNumber: "NB-1234"
 *         route: "Colombo to Kandy"
 *         driverName: "John Perera"
 *         capacity: 52
 */
