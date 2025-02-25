import express from "express";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const router = express.Router();

// Route to send Razorpay key to frontend
router.get("/key", (req, res) => {
  res.json({ razorpayKeyId: process.env.RAZORPAY_KEY_ID });
});

export default router;
