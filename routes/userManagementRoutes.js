const express = require("express");

const {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
} = require("../controllers/userManagementController");

const {
  protect,
  allowRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==============================
// Everything below this point
// requires:
// 1. Logged-in user
// 2. Admin role
// ==============================

router.use(
  protect,
  allowRoles("Admin")
);


// ==============================
// Get All Registered Users
// GET /api/admin/users
// ==============================

router.get(
  "/",
  getAllUsers
);


// ==============================
// Change User Role
// PATCH /api/admin/users/:userId/role
// ==============================

router.patch(
  "/:userId/role",
  updateUserRole
);


// ==============================
// Activate / Deactivate Account
// PATCH /api/admin/users/:userId/status
// ==============================

router.patch(
  "/:userId/status",
  updateUserStatus
);


module.exports = router;