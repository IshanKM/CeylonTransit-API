// src/models/Route.js
import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lng: Number,
    distance_from_start: Number // km
});

const routeSchema = new mongoose.Schema({
    route_number: { type: String, unique: true },
    start: String,
    end: String,
    stops: [stopSchema],
    full_distance: Number
}, { timestamps: true });

export default mongoose.model('Route', routeSchema);
