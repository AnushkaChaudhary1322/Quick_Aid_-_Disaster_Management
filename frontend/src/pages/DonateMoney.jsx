import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";

const DonateMoney = () => {
  const [amount, setAmount] = useState(""); // Store user input
  const [razorpayKey, setRazorpayKey] = useState(""); // Store Razorpay Key

  // Fetch Razorpay key from backend
  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/razorpay/key", {
          withCredentials: true,
        });
        setRazorpayKey(response.data.razorpayKeyId); // Set Razorpay key from response
      } catch (error) {
        console.error("Error fetching Razorpay key:", error);
      }
    };

    fetchRazorpayKey();
  }, []);

  const handlePayment = async () => {
    // Validation for the amount entered
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid donation amount!");
      return;
    }

    if (!razorpayKey) {
      alert("Razorpay key not loaded.");
      return;
    }

    try {
      // Send donation amount to the backend to create Razorpay order
      const { data } = await axios.post(
        "http://localhost:3000/api/money-donations/create-order", // Backend API URL
        { amount },
        { withCredentials: true }
      );

      console.log("Backend Response:", data); // Log backend response for debugging

      // Step 2: Use Razorpay Checkout to handle payment
      const options = {
        key: razorpayKey, // Razorpay key retrieved from backend
        amount: data.amount * 100, // Amount in paise (from backend response, multiplied by 100)
        currency: "INR",
        name: "Disaster Management Donation",
        description: "Donation for disaster relief",
        image: "/path/to/your/logo.png", // Optional: Add logo if needed
        order_id: data.orderId, // Order ID from backend
        handler: function (response) {
          console.log("Razorpay Response: ", response); // Log the Razorpay response

          alert("Donation successful! Payment ID: " + response.razorpay_payment_id);

          // Send the payment details to the backend to record the payment
          axios
            .post("http://localhost:3000/api/money-donations/save-payment", {
              razorpayPaymentId: response.razorpay_payment_id,
              orderId: data.orderId,
              donationAmount: amount,
            })
            .then(() => {
              alert("Payment information saved successfully!");
              window.location.reload();
            })
            .catch((error) => {
              alert("Error saving payment information.");
              console.error("Error saving payment: ", error);
            });
        },
        prefill: {
          name: "Donor's Name", // Customize this based on your app data
          email: "donor@example.com", // Same here
          contact: "+919876543210", // Same here
        },
        theme: {
          color: "#F37254", // Customize the theme color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open(); // Open Razorpay modal

    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      if (error.response) {
        console.error("Error Response: ", error.response.data);
      } else if (error.request) {
        console.error("Error Request: ", error.request);
      } else {
        console.error("Error Message: ", error.message);
      }
      alert("Error processing your donation.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-between">
      <div className="w-full md:w-1/2 p-4 md:pr-8">
        <img src="/svg.svg" alt="Donation Illustration" className="w-full" />
      </div>
      <div className="w-full md:w-1/2 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Donate Money</h2>
          <Label htmlFor="amount">Amount:</Label>
          <TextInput
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter donation amount"
          />
          <Button color="success" className="mt-4" onClick={handlePayment}>
            Donate
          </Button>
          <Button color="primary" className="mt-2" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DonateMoney;
