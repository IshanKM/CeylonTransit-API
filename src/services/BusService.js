// src/services/BusService.js
import Bus from '../models/Bus.js';

 class BusService {
  static async create(data) {
    const bus = new Bus(data);
    return bus.save();
  }
  static async getById(id) {
    return Bus.findById(id).lean();
  }
  static async getByBusId(busId) {
    return Bus.findOne({ busId }).lean();
  }
  static async setCurrentTrip(busId, tripObjectId) {
    return Bus.findByIdAndUpdate(busId, { currentTrip: tripObjectId }, { new: true });
  }
}

export default BusService;