// src/services/ScheduleService.js
import Schedule from '../models/Schedule.js';
import ScheduleModel from '../models/Schedule.js';

class ScheduleService {
  static create(data) { return Schedule.create(data); }
  static findActiveForBus(busId, now = new Date()) {
    return Schedule.findOne({
      bus: busId,
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).populate('route bus').exec();
  }
  static findByScheduleId(scheduleId) { return Schedule.findOne({ scheduleId }).populate('route bus').exec(); }
}
export default ScheduleService;
