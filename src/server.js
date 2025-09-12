import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// test health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// hello world endpoint
app.get("/api/hello", (req, res) => {
  res.send("Hello, CeylonTransit API is running 🚍");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚍 Server running on port ${PORT}`));

