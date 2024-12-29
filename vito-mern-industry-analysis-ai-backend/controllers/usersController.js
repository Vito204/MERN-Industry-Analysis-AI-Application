const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isAuthenticated = require("../Middlewares/isAuthenticated");

//1 Registration
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  //Check if inputs are validate
  if (!username || !email || !password) {
    res.status(400).json({ message: "Please enter all the fields" });
  }
  //Check if the email is taken
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
  }
  //Hash the password
  const salt = await bcrypt.genSalt(9);
  const hashedPassword = await bcrypt.hash(password, salt);
  //Create user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  //Add the date of trial expiration
  newUser.trialExpires = new Date(
    //1 week trail
    Date.now() + newUser.trialPeriod * 24 * 60 * 60 * 1000
  );
  //Save user
  await newUser.save();
  res.json({
    status: true,
    message: "Registration successful",
    user: {
      username: newUser.username,
      email: newUser.email,
    },
  });
});

//2 Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //Check if user exists
  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }
  //Check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user?.password);
  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid password");
  }
  //Generate token
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
  //Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
    maxAge: 5 * 24 * 60 * 60 * 1000, //5 days
  });
  //Send response
  res.json({
    status: true,
    message: "Login successful",
    id: user?._id,
    username: user?.username,
    email: user?.email,
  });
});

//3 Logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { maxAge: 5 * 24 * 60 * 60 * 1000 });
  res.status(200).json({
    status: true,
    message: "Logout successful",
  });
});

//4 Profile
const userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?.id)
    .select("-password")
    .populate("payments")
    .populate("contentHistory");
  if (user) {
    res.status(200).json({
      status: true,
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//5 Check if user is authenticated
const checkAuth = asyncHandler(async (req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  if (decoded) {
    res.json({
      isAuthenticated: true,
    });
  } else {
    res.json({
      isAuthenticated: false,
    });
  }
});

module.exports = { register, login, logout, userProfile, checkAuth };
