// src/models/Position.js
import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema({
    bus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
    gps_id: { type: mongoose.Schema.Types.ObjectId, ref: 'GPSModule' },
    lat: Number,
    lng: Number,
    stop_name: String,
    battery_level: Number,
    temperature: Number,
    status: String, // running, arrived, delayed
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Position', positionSchema);
