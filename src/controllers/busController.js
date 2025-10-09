import Bus from '../models/Bus.js';

export const createBus = async (req, res) => {
    try {
        const bus = new Bus(req.body);
        await bus.save();
        res.status(201).json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find().populate('route_ids');
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id).populate('route_ids');
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndDelete(req.params.id);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        res.json({ message: 'Bus deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
