// src/models/Location.js
import mongoose from 'mongoose';

const StopMatchedSchema = new mongoose.Schema({
  stopId: String,
  stopName: String,
  distance: Number
}, { _id: false });

const LocationSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true, index: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', index: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', index: true },
  deviceId: String,
  timestamp: { type: Date, default: Date.now, index: true },
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], required: true } },
  speed: Number,
  heading: Number,
  battery: Number,
  temperature: Number,
  status: String,
  stopMatched: { type: StopMatchedSchema, default: null }
}, { timestamps: true });

LocationSchema.index({ location: '2dsphere' });

export default mongoose.model('Location', LocationSchema);
