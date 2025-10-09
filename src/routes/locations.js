import { Router } from "express";
import LocationService from "../services/LocationService.js";
import { requireApiKey } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Locations
 *   description: Endpoints for sending and retrieving bus location data
 */

/**
 * @swagger
 * /api/v1/locations:
 *   post:
 *     summary: Send a new bus location
 *     tags: [Locations]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationInput'
 *     responses:
 *       201:
 *         description: Location saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationResponse'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Missing or invalid API key
 *       500:
 *         description: Internal server error
 */
router.post("/", requireApiKey, async (req, res) => {
  try {
    console.log("📡 Received POST /api/v1/locations");
    console.log("➡️  Incoming data:", req.body);

    const saved = await LocationService.receive(req.body);

    console.log("✅ Location saved for:", req.body.busId);
    res.status(201).json({
      success: true,
      message: "Bus location saved successfully",
      data: saved,
    });
  } catch (err) {
    console.error("❌ Error in /api/v1/locations:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/v1/locations/live:
 *   get:
 *     summary: Get the latest live bus locations for a specific route
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: routeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the route to fetch live bus locations for
 *     responses:
 *       200:
 *         description: Latest location data for buses on the given route
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LiveLocationResponse'
 *       400:
 *         description: routeId required
 *       500:
 *         description: Internal server error
 */
router.get("/live", async (req, res) => {
  try {
    const { routeId } = req.query;
    if (!routeId)
      return res
        .status(400)
        .json({ success: false, message: "routeId required" });

    const latest = await LocationService.getLatestByRoute(routeId);
    res.json({ success: true, data: latest });
  } catch (err) {
    console.error("❌ Error getting live:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/v1/locations/history:
 *   get:
 *     summary: Get location history for a specific trip
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: The trip ID to fetch location history for
 *     responses:
 *       200:
 *         description: List of location points for the trip
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoryResponse'
 *       400:
 *         description: tripId required
 *       500:
 *         description: Internal server error
 */
router.get("/history", async (req, res) => {
  try {
    const { tripId } = req.query;
    if (!tripId)
      return res
        .status(400)
        .json({ success: false, message: "tripId required" });

    const history = await LocationService.getHistoryByTrip(tripId);
    res.json({ success: true, data: history });
  } catch (err) {
    console.error("❌ Error getting history:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 *
 *   schemas:
 *     LocationInput:
 *       type: object
 *       required:
 *         - busId
 *         - latitude
 *         - longitude
 *         - timestamp
 *       properties:
 *         busId:
 *           type: string
 *           description: The unique ID of the bus sending the location
 *         latitude:
 *           type: number
 *           format: float
 *           description: Current latitude of the bus
 *         longitude:
 *           type: number
 *           format: float
 *           description: Current longitude of the bus
 *         speed:
 *           type: number
 *           format: float
 *           description: Current speed of the bus in km/h
 *         temperature:
 *           type: number
 *           format: float
 *           description: Current temperature inside the bus
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The time the data was recorded
 *       example:
 *         busId: "671f7b9df2a67e001f63ab8b"
 *         latitude: 6.9271
 *         longitude: 79.8612
 *         speed: 45.5
 *         temperature: 30.2
 *         timestamp: "2025-10-09T05:30:00Z"
 *
 *     LocationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/LocationInput'
 *
 *     LiveLocationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LocationInput'
 *
 *     HistoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LocationInput'
 */
