const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required. Please log in.",
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is missing.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(503).json({
        message: "JWT_SECRET is not configured on the server",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.mongoId || decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "User associated with this token no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "This BookVerse account is inactive.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Your login session has expired. Please log in again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }

    return res.status(401).json({
      message: "Invalid or expired authentication token",
      error: error.message,
    });
  }
};

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};

const requireSelfOrAdmin = (paramName = "userId") => {
  return (req, res, next) => {
    const targetUserId = req.params[paramName] || req.body.userId;

    if (
      req.user.role === "Admin" ||
      String(req.user._id) === String(targetUserId) ||
      String(req.user.userId) === String(targetUserId)
    ) {
      return next();
    }

    return res.status(403).json({
      message: "You can only access your own resources",
    });
  };
};

const authenticate = protect;
const authorizeRoles = allowRoles;

module.exports = {
  protect,
  allowRoles,
  authenticate,
  authorizeRoles,
  requireSelfOrAdmin,
};
