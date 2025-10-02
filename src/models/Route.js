// src/models/Route.js
import mongoose from 'mongoose';

const StopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinates: { type: [Number], required: true } // [lng, lat]
}, { _id: false });

const RouteSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true }, // human-friendly id
  name: { type: String, required: true },
  stops: { type: [StopSchema], default: [] },
  geometry: {
    type: { type: String, enum: ['LineString'], default: 'LineString' },
    coordinates: { type: [[Number]], default: [] } // [[lng,lat],...]
  },
  estimatedDuration: Number // minutes
}, { timestamps: true });

export default mongoose.model('Route', RouteSchema);
