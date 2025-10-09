import GPSModule from '../models/GPSModule.js';

export const createGPSModule = async (req, res) => {
    try {
        const gps = new GPSModule(req.body);
        await gps.save();
        res.status(201).json(gps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllGPSModules = async (req, res) => {
    try {
        const gpsModules = await GPSModule.find().populate('assigned_bus');
        res.json(gpsModules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getGPSModuleById = async (req, res) => {
    try {
        const gps = await GPSModule.findById(req.params.id).populate('assigned_bus');
        if (!gps) return res.status(404).json({ message: 'GPS module not found' });
        res.json(gps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateGPSModule = async (req, res) => {
    try {
        const gps = await GPSModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!gps) return res.status(404).json({ message: 'GPS module not found' });
        res.json(gps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteGPSModule = async (req, res) => {
    try {
        const gps = await GPSModule.findByIdAndDelete(req.params.id);
        if (!gps) return res.status(404).json({ message: 'GPS module not found' });
        res.json({ message: 'GPS module deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
