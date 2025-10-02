// src/services/LocationService.js
import Location from '../models/Location.js';

export default class LocationService {
  static async create(data) {
    const loc = new Location(data);
    return loc.save();
  }

  static async getLatestByBus(busObjectId) {
    return Location.findOne({ bus: busObjectId }).sort({ timestamp: -1 }).lean();
  }

  // live positions for a route: latest location per bus on route
  static async getLatestByRoute(routeObjectId) {
    const pipeline = [
      { $match: { route: routeObjectId } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$bus',
          bus: { $first: '$bus' },
          trip: { $first: '$trip' },
          timestamp: { $first: '$timestamp' },
          location: { $first: '$location' },
          speed: { $first: '$speed' },
          heading: { $first: '$heading' }
        }
      }
    ];
    return Location.aggregate(pipeline);
  }

  static async getHistoryByTrip(tripObjectId, limit = 1000) {
    return Location.find({ trip: tripObjectId }).sort({ timestamp: 1 }).limit(limit).lean();
  }
}
