const express = require("express");

const {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// Create a notification
router.post("/", createNotification);

// Get all notifications for one user
router.get("/user/:userId", getUserNotifications);

// Get unread notification count
router.get("/user/:userId/unread-count", getUnreadCount);

// Mark all notifications of a user as read
router.patch("/user/:userId/read-all", markAllAsRead);

// Mark one notification as read
router.patch("/:notificationId/read", markAsRead);

// Delete one notification
router.delete("/:notificationId", deleteNotification);

module.exports = router;