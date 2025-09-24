import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

// connect MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚍 Server running on port ${PORT}`));
