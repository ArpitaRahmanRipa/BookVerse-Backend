const express = require("express");

const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==============================
// Register
// POST /api/auth/register
// ==============================

router.post(
  "/register",
  register
);


// ==============================
// Login
// POST /api/auth/login
// ==============================

router.post(
  "/login",
  login
);

// ==============================
// Current Logged-In User
// GET /api/auth/me
// ==============================

router.get(
  "/me",
  protect,
  getCurrentUser
);

module.exports = router;