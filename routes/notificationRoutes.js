const express = require("express");

const router = express.Router();


// Check route loading
console.log("NOTIFICATION ROUTES LOADED");


// Import controller functions
const {
    getNotifications,
    markNotificationRead
} = require("../controllers/notificationController");



// ==========================================
// GET USER NOTIFICATIONS
// GET /api/notifications/:userId
//
// Example:
// http://127.0.0.1:9208/api/notifications/reader002
// ==========================================

router.get(
    "/:userId",
    getNotifications
);




// ==========================================
// MARK NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
//
// Example:
// /api/notifications/64abcd123/read
// ==========================================

router.patch(
    "/:id/read",
    markNotificationRead
);




// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;