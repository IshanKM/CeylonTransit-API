// src/models/Bus.js
import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
    name: String,
    registration_number: { type: String, unique: true },
    type: { type: String, enum: ['Express','Normal'], default: 'Normal' },
    capacity: Number,
    operator_name: String, // NTC or private
    route_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Route' }]
}, { timestamps: true });

export default mongoose.model('Bus', busSchema);
