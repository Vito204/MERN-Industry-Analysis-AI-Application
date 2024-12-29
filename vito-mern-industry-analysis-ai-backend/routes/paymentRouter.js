const express = require("express");
const isAuthenticated = require("../Middlewares/isAuthenticated");
const {
  handlePayment,
  verifyPayment,
  handleFreeSubscription,
} = require("../controllers/paymentController");

const paymentRouter = express.Router();

paymentRouter.post("/checkout", isAuthenticated, handlePayment);
paymentRouter.post(
  "/verify-payment/:paymentId",
  isAuthenticated,
  verifyPayment
);
paymentRouter.post("/free-plan", isAuthenticated, handleFreeSubscription);

module.exports = paymentRouter;
