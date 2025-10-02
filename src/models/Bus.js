// src/models/Bus.js
import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },
  registration: String,
  operator: String,
  capacity: Number,
  currentTrip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    default: null
  }
}, { timestamps: true });

// ✅ Correct default export
export default mongoose.model("Bus", BusSchema);
