const jwt = require("jsonwebtoken");
const asyncWrapper = require("./asyncWrapper");
const User = require("../models/users-model");
const httpStatusText = require("../utils/httpStatusText");
const appErrors = require("../utils/appErrors");

module.exports.auth = () => {
  return asyncWrapper(async (req, res, next) => {
    // Extract Authorization header
    const authHeader = req.headers["authorization"]; // Fix typo: 'headres' to 'headers'
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = appErrors.create(
        "Please login first",
        401,
        httpStatusText.FAIL
      );
      return next(error);
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = appErrors.create(
        "Token not provided",
        401,
        httpStatusText.FAIL
      );
      return next(error);
    }

    let decodedToken;
    try {
      // Verify token
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const error = appErrors.create(
        "Invalid or expired token",
        403,
        httpStatusText.FAIL
      );
      return next(error);
    }

    // Verify token content
    if (!decodedToken.userId) {
      const error = appErrors.create(
        "Token not valid",
        400,
        httpStatusText.FAIL
      );
      return next(error);
    }

    // Fetch user
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) {
      const error = appErrors.create(
        "User not found",
        404,
        httpStatusText.FAIL
      );
      return next(error);
    }

    // Attach user to the request
    req.authUser = user;
    next();
  });
};
