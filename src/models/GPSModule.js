// src/models/GPSModule.js
import mongoose from 'mongoose';

const gpsModuleSchema = new mongoose.Schema({
    gps_id: { type: String, unique: true },
    assigned_bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
    battery_level: Number,
    status: { type: String, enum: ['active','inactive'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('GPSModule', gpsModuleSchema);
