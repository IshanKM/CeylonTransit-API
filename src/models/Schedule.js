// src/models/Schedule.js
import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    bus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
    route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    start_time: String, // e.g., '08:00'
    end_time: String,   // e.g., '13:00'
    day_of_week: { type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] }
}, { timestamps: true });

export default mongoose.model('Schedule', scheduleSchema);
