// src/services/TripService.js
import Trip from '../models/Trip.js';

class TripService {
  static async create(data) {
    const trip = new Trip(data);
    return trip.save();
  }
  static async findById(id) {
    return Trip.findById(id).populate('route bus').lean();
  }
  static async listByRoute(routeId) {
    return Trip.find({ route: routeId }).populate('bus').lean();
  }
  static async updateStatus(id, status) {
    return Trip.findByIdAndUpdate(id, { status }, { new: true });
  }
}

export default TripService;