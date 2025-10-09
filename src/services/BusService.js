// src/services/BusService.js
import Bus from '../models/Bus.js';

class BusService {
  static findByBusId(busId) { return Bus.findOne({ busId }); }
  static findById(id) { return Bus.findById(id); }
  static create(data) { return Bus.create(data); }
  static updateById(id, data) { return Bus.findByIdAndUpdate(id, data, { new: true }); }
  static updateByBusId(busId, data) { return Bus.findOneAndUpdate({ busId }, data, { new: true }); }
}
export default BusService;
