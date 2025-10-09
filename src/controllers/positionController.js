import Position from '../models/Position.js';
import Bus from '../models/Bus.js';
import GPSModule from '../models/GPSModule.js';
import { getLocationName } from '../utils/geolocation.js';

// Add new position (live tracking)
export const createPosition = async (req, res) => {
    try {
        const { bus_id, gps_id, lat, lng, battery_level, temperature, status } = req.body;

        const stop_name = await getLocationName(lat, lng); // reverse geocode to get city name

        const position = new Position({
            bus_id, gps_id, lat, lng, battery_level, temperature, status, stop_name
        });

        await position.save();
        res.status(201).json(position);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get last position of a bus
export const getLastPosition = async (req, res) => {
    try {
        const position = await Position.findOne({ bus_id: req.params.busId }).sort({ timestamp: -1 });
        if (!position) return res.status(404).json({ message: 'No position found' });
        res.json(position);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all positions of a bus (history)
export const getBusPositions = async (req, res) => {
    try {
        const positions = await Position.find({ bus_id: req.params.busId }).sort({ timestamp: 1 });
        res.json(positions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cleanup old positions (older than 90 days)
export const cleanupOldPositions = async () => {
    try {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 90);
        await Position.deleteMany({ timestamp: { $lt: cutoff } });
        console.log('Old positions cleaned up');
    } catch (err) {
        console.error(err);
    }
};
