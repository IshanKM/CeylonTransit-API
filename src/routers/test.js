import { Router } from "express";
import Test from "../models/TestDB.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const doc = new Test({ name: "Hello from DB 🚀" });
    await doc.save();
    res.json({ message: "Saved to DB", doc });
  } catch (err) {
    res.status(500).json({ message: "DB save failed", error: err.message });
  }
});

export default router;
