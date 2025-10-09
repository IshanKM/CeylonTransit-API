// src/models/Trip.js
import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  tripId: { type: String, required: true, unique: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  scheduledStart: { type: Date, required: true },
  scheduledEnd: { type: Date, required: true },
  status: { type: String, enum: ['scheduled','running','completed','cancelled'], default: 'scheduled' },
  actualStart: Date,
  actualEnd: Date
}, { timestamps: true });

export default mongoose.model('Trip', TripSchema);
