const asyncHandler = require("express-async-handler");
const calculateNextBillingDate = require("../utils/calculateNextBillingDate");
const {
  shouldRenewSubscriptionPlan,
} = require("../utils/shouldRenewSubscriptionPlan");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const User = require("../models/User");

//1 Normal payment
const handlePayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;
  const user = req?.user;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "usd",
      //add some data the meta object
      metadata: {
        userId: user?.id.toString(),
        userEmail: user?.email,
        subscriptionPlan,
      },
    });

    //send response
    res.json({
      clientSecret: paymentIntent?.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Payment failed");
  }
});

//2 Check payment status
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    if (paymentIntent?.status === "succeeded") {
      //get metadata
      const metadata = paymentIntent?.metadata;
      const subscriptionPlan = metadata?.subscriptionPlan;
      const userEmail = metadata?.userEmail;
      const userId = metadata?.userId;
      //find user
      const userFound = await User.findById(userId);
      if (!userFound) {
        return res.status(404).json({
          status: "false",
          message: "User not found",
        });
      }
      //get payment details
      const amount = paymentIntent?.amount / 100;
      const currency = paymentIntent?.currency;
      const paymentId = paymentIntent?.id;
      //create payment history
      const newPayment = await Payment.create({
        use: userFound?._id,
        email: userEmail,
        subscriptionPlan,
        amount,
        currency,
        status: "success",
        reference: paymentId,
      });
      //check for the subscription plan
      if (subscriptionPlan === "Basic") {
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 50,
          subscriptionPlan: "Basic",
          $addToSet: { payments: newPayment?._id },
        });
        res.json({
          status: true,
          message: "Subscription upgraded successfully!",
          updatedUser,
        });
      }
      if (subscriptionPlan === "Premium") {
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 50,
          subscriptionPlan: "Premium",
          $addToSet: { payments: newPayment?._id },
        });
        res.json({
          status: true,
          message: "Subscription upgraded successfully!",
          updatedUser,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//3 Free subscription
const handleFreeSubscription = asyncHandler(async (req, res) => {
  const user = req?.user;
  try {
    //check if user should renew subscription
    if (shouldRenewSubscriptionPlan(user)) {
      user.subscriptionPlan = "Free";
      user.monthlyRequestCount = 10;
      user.apiRequestCount = 0;
      user.nextBillingDate = calculateNextBillingDate();
      //create new payment and save into db
      const newPayment = await Payment.create({
        username: user?._id,
        subscriptionPlan: "Free",
        amount: 0,
        status: "success",
        reference: Math.random().toString(36).substring(7),
        monthlyRequestCount: 10,
        currency: "usd",
      });
      user.payments.push(newPayment?._id);
      //save user
      await user.save();
      res.json({
        status: "success",
        message: "Subscription renewed successfully!",
      });
    } else {
      return res.status(403).json({ error: "Subscription are not due yet" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { handlePayment, verifyPayment, handleFreeSubscription };
