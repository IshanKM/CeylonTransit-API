// src/services/RouteService.js
import Route from '../models/Route.js';

class RouteService {
  static async create(data) {
    const route = new Route(data);
    return route.save();
  }
  static async list() {
    return Route.find().lean();
  }
  static async findById(id) {
    return Route.findById(id).lean();
  }
  static async findByRouteId(routeId) {
    return Route.findOne({ routeId }).lean();
  }
}

export default RouteService;