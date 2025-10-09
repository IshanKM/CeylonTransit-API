import Schedule from '../models/Schedule.js';

export const createSchedule = async (req, res) => {
    try {
        const schedule = new Schedule(req.body);
        await schedule.save();
        res.status(201).json(schedule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('bus_id').populate('route_id');
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id).populate('bus_id').populate('route_id');
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
        res.json({ message: 'Schedule deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
