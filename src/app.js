// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import busRoutes from './routes/buses.js';
import routeRoutes from './routes/routes.js';
import scheduleRoutes from './routes/schedules.js';
import positionRoutes from './routes/positions.js';
import gpsRoutes from './routes/gpsModules.js';
import rateLimit from './middleware/rateLimit.js';

// ✅ Import Swagger configuration
import { swaggerUi, swaggerSpec } from './config/swagger.js';

dotenv.config();

const app = express();

// 🧩 Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit);

// 🚏 API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/gps', gpsRoutes);

// 📘 Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ⚙️ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`🚍 Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));

export default app;
