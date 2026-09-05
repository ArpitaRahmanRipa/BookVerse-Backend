const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(503).json({
        message: "JWT_SECRET is not configured on the server",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token",
      error: error.message,
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};

const requireSelfOrAdmin = (paramName = "userId") => {
  return (req, res, next) => {
    const targetUserId =
      req.params[paramName] || req.body.userId;

    if (
      req.user.role === "Admin" ||
      String(req.user._id) === String(targetUserId)
    ) {
      return next();
    }

    return res.status(403).json({
      message: "You can only access your own resources",
    });
  };
};

module.exports = {
  authenticate,
  authorizeRoles,
  requireSelfOrAdmin,
};
