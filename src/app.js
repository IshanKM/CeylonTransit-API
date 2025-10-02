// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routesRouter from './routers/routes.js';
import busesRouter from './routers/buses.js';
import tripsRouter from './routers/trips.js';
import locationsRouter from './routers/locations.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// versioned API
app.use('/api/v1/routes', routesRouter);
app.use('/api/v1/buses', busesRouter);
app.use('/api/v1/trips', tripsRouter);
app.use('/api/v1/locations', locationsRouter);

app.get('/', (req, res) => res.send('CeylonTransit API root. Use /api/v1/...'));

export default app;
