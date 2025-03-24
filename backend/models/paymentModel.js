// models/paymentModel.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    razorpayPaymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    donationAmount: { type: Number, required: true },
    status: { type: String, default: "pending" }, // 'pending', 'success', 'failed'
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
