import express from 'express';
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute
} from '../controllers/routeController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: Manage bus routes and stops
 */

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Get all routes
 *     description: Retrieves a list of all bus routes available.
 *     tags: [Routes]
 *     responses:
 *       200:
 *         description: List of routes successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RouteListResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllRoutes);

/**
 * @swagger
 * /api/routes/{id}:
 *   get:
 *     summary: Get route by ID
 *     description: Retrieves detailed information about a specific route by its ID.
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the route
 *     responses:
 *       200:
 *         description: Route details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RouteResponse'
 *       404:
 *         description: Route not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getRouteById);

/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Create a new route
 *     description: Add a new bus route (Admin only).
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RouteInput'
 *     responses:
 *       201:
 *         description: Route created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RouteResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — only admins can create routes
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, isAdmin, createRoute);

/**
 * @swagger
 * /api/routes/{id}:
 *   put:
 *     summary: Update a route
 *     description: Update route details (Admin only).
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the route to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RouteInput'
 *     responses:
 *       200:
 *         description: Route updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — only admins can update routes
 *       404:
 *         description: Route not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', verifyToken, isAdmin, updateRoute);

/**
 * @swagger
 * /api/routes/{id}:
 *   delete:
 *     summary: Delete a route
 *     description: Delete a specific bus route by ID (Admin only).
 *     tags: [Routes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the route to delete
 *     responses:
 *       200:
 *         description: Route deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — only admins can delete routes
 *       404:
 *         description: Route not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', verifyToken, isAdmin, deleteRoute);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Stop:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the stop
 *         distanceFromStart:
 *           type: number
 *           description: Distance (in km) from the start of the route
 *
 *     RouteInput:
 *       type: object
 *       required:
 *         - name
 *         - start
 *         - end
 *         - stops
 *       properties:
 *         name:
 *           type: string
 *           description: Route name
 *         start:
 *           type: string
 *           description: Starting point
 *         end:
 *           type: string
 *           description: Destination point
 *         distance:
 *           type: number
 *           description: Total distance of the route
 *         stops:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Stop'
 *       example:
 *         name: "Route 25 - Colombo to Kandy"
 *         start: "Colombo"
 *         end: "Kandy"
 *         distance: 115
 *         stops:
 *           - name: "Mawanella"
 *             distanceFromStart: 75
 *           - name: "Peradeniya"
 *             distanceFromStart: 110
 *
 *     RouteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/RouteInput'
 *
 *     RouteListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RouteInput'
 */
