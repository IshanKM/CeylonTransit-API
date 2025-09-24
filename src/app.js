import express from "express";
import cors from "cors";
import helmet from "helmet";

import TestRouter from "./routers/test.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// routes

app.get('/', (req, res) => {
  res.send('CeylonTransit-API is running 🚀');
});

app.use("/api/test", TestRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

export default app;