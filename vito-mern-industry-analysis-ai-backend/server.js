const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cron = require("node-cron");
const cors = require("cors");
const { errorHandler } = require("./Middlewares/errorMiddleware");
const connectDB = require("./utils/connectDB");
const usersRouter = require("./routes/usersRouter");
const openAIRouter = require("./routes/openAIRouter");
const paymentRouter = require("./routes/paymentRouter");
const User = require("./models/User");

const app = express();
const PORT = 5000;

//Cron for trial period: run every day
cron.schedule("0 0 * * * *", async () => {
  try {
    const today = new Date();
    await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today },
      },
      { trialActive: false, subscriptionPlan: "Free", monthlyRequestCount: 10 }
    );
  } catch (error) {
    console.log(error);
  }
});
//Cron for free plan: run every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      { monthlyRequestCount: 0 }
    );
  } catch (error) {
    console.log(error);
  }
});
//Cron for Basic plan: run every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      { monthlyRequestCount: 0 }
    );
  } catch (error) {
    console.log(error);
  }
});
//Cron for Premium plan: run every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      { monthlyRequestCount: 0 }
    );
  } catch (error) {
    console.log(error);
  }
});

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

//Routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/openai", openAIRouter);
app.use("/api/v1/stripe", paymentRouter);

//Connect DB
connectDB();

//Start server
app.listen(PORT, console.log(`Server started on port ${PORT}`));
