import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  timestamp: { type: Date, default: Date.now },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  speed: Number,
  heading: Number
});

// Add 2dsphere index for geo queries
LocationSchema.index({ location: "2dsphere" });

export default mongoose.model("Location", LocationSchema);
