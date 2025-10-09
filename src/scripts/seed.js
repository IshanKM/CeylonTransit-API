// src/scripts/seed.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Route from '../models/Route.js';
import Bus from '../models/Bus.js';
import Schedule from '../models/Schedule.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected to DB');

  const routes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/routes.json')));
  const buses = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/buses.json')));
  const schedules = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/schedules.json')));

  await Route.deleteMany({});
  await Bus.deleteMany({});
  await Schedule.deleteMany({});

  const routeDocs = await Route.insertMany(routes);
  console.log('Inserted routes:', routeDocs.length);

  // map routeId -> _id
  const routeMap = {};
  routeDocs.forEach(r => routeMap[r.routeId] = r._id);

  // prepare bus docs with route objectId
  const busDocsToInsert = buses.map(b => ({
    busId: b.busId,
    registration: b.registration,
    operator: b.operator,
    type: b.type,
    capacity: b.capacity,
    deviceId: b.deviceId,
    route: routeMap[b.routeId] || null
  }));

  const busDocs = await Bus.insertMany(busDocsToInsert);
  console.log('Inserted buses:', busDocs.length);

  const busMap = {};
  busDocs.forEach(b => busMap[b.busId] = b._id);

  // prepare schedules with route and bus ObjectIds
  const scheduleDocsToInsert = schedules.map(s => ({
    scheduleId: s.scheduleId,
    route: routeMap[s.routeId],
    bus: busMap[s.busId],
    startTime: new Date(s.startTime),
    endTime: new Date(s.endTime),
    direction: s.direction || 'forward',
    status: 'scheduled'
  })).filter(s => s.route && s.bus);

  const scheduleDocs = await Schedule.insertMany(scheduleDocsToInsert);
  console.log('Inserted schedules:', scheduleDocs.length);

  console.log('Seeding done');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
