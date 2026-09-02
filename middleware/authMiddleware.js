const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ==============================
// Protect Authenticated Routes
// ==============================

const protect = async (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization;


    // Expected format:
    // Authorization: Bearer TOKEN

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message:
          "Authentication required. Please log in.",
      });
    }


    const token =
      authorization.split(" ")[1];


    if (!token) {
      return res.status(401).json({
        message:
          "Authentication token is missing.",
      });
    }


    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is not configured."
      );
    }


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    const user = await User.findById(
      decoded.mongoId
    );


    if (!user) {
      return res.status(401).json({
        message:
          "User associated with this token no longer exists.",
      });
    }


    if (!user.isActive) {
      return res.status(403).json({
        message:
          "This BookVerse account is inactive.",
      });
    }


    // Make logged-in user available
    // to the next controller.

    req.user = user;


    next();

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message:
          "Your login session has expired. Please log in again.",
      });
    }


    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message:
          "Invalid authentication token.",
      });
    }


    return res.status(500).json({
      message:
        "Authentication verification failed.",
      error: error.message,
    });

  }
};


// ==============================
// Role Authorization
// ==============================

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }


    if (
      !allowedRoles.includes(req.user.role)
    ) {
      return res.status(403).json({
        message:
          "You do not have permission to access this resource.",
      });
    }


    next();
  };
};


module.exports = {
  protect,
  allowRoles,
};