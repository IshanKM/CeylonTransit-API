// src/services/TripService.js
import Trip from '../models/Trip.js';

class TripService {
  static async create(data) { return Trip.create(data); }
  static async findByTripId(tripId) { return Trip.findOne({ tripId }).populate('route bus').exec(); }
  static async updateStatus(tripId, update) { return Trip.findOneAndUpdate({ tripId }, update, { new: true }); }
  static async listByRoute(routeObjectId) { return Trip.find({ route: routeObjectId }).populate('bus').lean(); }
}
export default TripService;
