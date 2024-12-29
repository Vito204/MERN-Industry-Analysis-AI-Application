const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const checkApiRequestLimit = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const user = await User.findById(req?.user?.id);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  let requestLimit = 0;
  //check if the user is within the trial period
  if (user?.trialActive) {
    requestLimit = user?.monthlyRequestCount;
  }
  //check if the user has exceeded the request limit
  if (user?.apiRequestCount >= requestLimit) {
    throw new Error("Request limit exceeded, please upgrade your plan");
  }
  next();
});

module.exports = checkApiRequestLimit;
