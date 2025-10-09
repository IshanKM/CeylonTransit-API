import express from 'express';
import { 
  createGPSModule, 
  getAllGPSModules, 
  getGPSModuleById, 
  updateGPSModule, 
  deleteGPSModule 
} from '../controllers/gpsController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: GPSModules
 *   description: Manage GPS modules
 */

/**
 * @swagger
 * /api/gps:
 *   get:
 *     summary: Get all GPS modules
 *     tags: [GPSModules]
 *     responses:
 *       200:
 *         description: List of GPS modules
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
 *                     $ref: '#/components/schemas/GPSModule'
 */
router.get('/', getAllGPSModules);

/**
 * @swagger
 * /api/gps/{id}:
 *   get:
 *     summary: Get GPS module by ID
 *     tags: [GPSModules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: GPS module ID
 *     responses:
 *       200:
 *         description: GPS module details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GPSModule'
 */
router.get('/:id', getGPSModuleById);

/**
 * @swagger
 * /api/gps:
 *   post:
 *     summary: Create a new GPS module
 *     tags: [GPSModules]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GPSModuleInput'
 *     responses:
 *       201:
 *         description: GPS module created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GPSModule'
 */
router.post('/', verifyToken, isAdmin, createGPSModule);

/**
 * @swagger
 * /api/gps/{id}:
 *   put:
 *     summary: Update GPS module
 *     tags: [GPSModules]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: GPS module ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GPSModuleInput'
 *     responses:
 *       200:
 *         description: GPS module updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GPSModule'
 */
router.put('/:id', verifyToken, isAdmin, updateGPSModule);

/**
 * @swagger
 * /api/gps/{id}:
 *   delete:
 *     summary: Delete GPS module
 *     tags: [GPSModules]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: GPS module ID
 *     responses:
 *       200:
 *         description: GPS module deleted successfully
 */
router.delete('/:id', verifyToken, isAdmin, deleteGPSModule);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     GPSModuleInput:
 *       type: object
 *       required:
 *         - name
 *         - imei
 *       properties:
 *         name:
 *           type: string
 *           description: GPS module name
 *         imei:
 *           type: string
 *           description: Unique IMEI of the GPS device
 *       example:
 *         name: "Bus GPS Module 1"
 *         imei: "123456789012345"
 *
 *     GPSModule:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           $ref: '#/components/schemas/GPSModuleInput'
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
