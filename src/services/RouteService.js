// src/services/RouteService.js
import Route from '../models/Route.js';

class RouteService {
  static list() { return Route.find().lean(); }
  static findByRouteId(routeId) { return Route.findOne({ routeId }).lean(); }
  static findById(id) { return Route.findById(id).lean(); }
  static create(data) { return Route.create(data); }
}
export default RouteService;
