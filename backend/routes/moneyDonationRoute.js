import express from "express";
import Razorpay from "razorpay";
import { savePayment } from "../controllers/moneyDonationController.js";

const router = express.Router();

//saved payment router here
router.post("/save-payment", savePayment);

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Handle POST request to create order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body; 
  try {
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: "order_receipt_" + new Date().getTime(),
      payment_capture: 1, 
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      orderId: order.id,
      amount: amount * 100, // Convert amount to paise
    });
  } catch (error) {
    console.error("Error creating Razorpay order", error);
    res.status(500).json({ error: "Unable to create order" });
  }
});

export default router;
