import axios from "axios";

// Handle free subscription
export const handleFreeSubscriptionAPI = async () => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/stripe/free-plan",
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

// Stripe payment
export const createStripePaymentIntentAPI = async (payment) => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/stripe/checkout",
    {
      amount: Number(payment?.amount),
      subscription: payment?.plan,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

// Verify payment
export const verifyPaymentAPI = async (paymentId) => {
  const response = await axios.post(
    `http://localhost:5000/api/v1/stripe/verify-payment/${paymentId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
