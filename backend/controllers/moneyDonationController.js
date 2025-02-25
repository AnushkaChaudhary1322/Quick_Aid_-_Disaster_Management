// controllers/moneyDonationController.js
import Payment from "../models/paymentModel.js";

export const savePayment = async (req, res) => {
  const { razorpayPaymentId, orderId, donationAmount } = req.body;

  try {
    // Create a new payment record
    const payment = new Payment({
      razorpayPaymentId,
      orderId,
      donationAmount,
      status: "success", 
    });

    // Save the payment record to MongoDB
    await payment.save();

    res.status(200).json({ message: "Payment saved successfully!", payment });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({ message: "Error saving payment" });
  }
};
