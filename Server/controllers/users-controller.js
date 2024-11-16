const User = require("../models/users-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appErrors");
const httpStatusText = require("../utils/httpStatusText");

// Register a new user
const register = asyncWrapper(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      appError.create(
        "User already exists with this email",
        400,
        httpStatusText.FAIL
      )
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  // Generate JWT token
  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1y",
  });

  // Save token in database
  newUser.token = token;
  await newUser.save();

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "User registered successfully",
    data: {
      username: newUser.username,
      token,
    },
  });
});

// Login an existing user
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      appError.create("Invalid email or password", 400, httpStatusText.FAIL)
    );
  }

  // Compare the passwords
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(appError("Invalid email or password", 400));
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1y",
  });

  // Save token in database
  user.token = token;
  await user.save();

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Login successful",
    data: {
      username: user.username,
      token,
    },
  });
});

module.exports = {
  register,
  login,
};
