const express = require("express");

const {
  updateCurrentUser,
  getPublicUserProfile,
} = require("../controllers/userController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==============================
// Update Logged-In User Profile
// PUT /api/users/me
// ==============================

router.put(
  "/me",
  protect,
  updateCurrentUser
);


// ==============================
// View Public User Profile
// GET /api/users/:userId
// ==============================

router.get(
  "/:userId",
  getPublicUserProfile
);


module.exports = router;