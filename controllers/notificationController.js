const Notification = require("../models/Notification");
const {
  sendNotificationEmail,
} = require("../services/emailService");

// Reusable helper.
// Other features such as Follow, Review Like, Comment, etc.
// can call this function to create a notification.
const createNotificationRecord = async ({
  recipientId,
  actorId = "",
  actorName = "",
  type,
  message,
  relatedId = "",
  relatedType = "",
  link = "",
  recipientEmail = "",
}) => {
  // First save the in-app notification.
  const notification = await Notification.create({
    recipientId,
    actorId,
    actorName,
    type,
    message,
    relatedId,
    relatedType,
    link,
  });

  // Email subject based on notification type.
  const emailSubjects = {
    follow: "You have a new follower on BookVerse",
    review_like: "Someone liked your review",
    review_comment:
      "Someone commented on your review",
    list_like:
      "Someone liked your reading list",
    reading_reminder:
      "BookVerse reading reminder",
    moderation_update:
      "BookVerse moderation update",
  };

  try {
    const emailResult =
      await sendNotificationEmail({
        to: recipientEmail,
        subject:
          emailSubjects[type] ||
          "New BookVerse notification",
        message,
      });

    if (emailResult.sent) {
      notification.emailSent = true;
      await notification.save();
    }
  } catch (emailError) {
    // Email failure must not break
    // the in-app notification.
    console.error(
      "Failed to send notification email:",
      emailError.message
    );
  }

  return notification;
};

// Create notification through API
// Useful for testing with Postman
const createNotification = async (req, res) => {
  try {
    const {
      recipientId,
      actorId,
      actorName,
      type,
      message,
      relatedId,
      relatedType,
      link,
    } = req.body;

    if (!recipientId || !type || !message) {
      return res.status(400).json({
        message:
          "recipientId, type, and message are required",
      });
    }

    const notification =
      await createNotificationRecord({
        recipientId,
        actorId,
        actorName,
        type,
        message,
        relatedId,
        relatedType,
        link,
      });

    res.status(201).json({
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create notification",
      error: error.message,
    });
  }
};

// Get all notifications of one user
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const filter = {
      recipientId: userId,
    };

    // Example:
    // /api/notifications/user/21201436?unread=true
    if (req.query.unread === "true") {
      filter.isRead = false;
    }

    const notifications = await Notification.find(
      filter
    ).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Notifications fetched successfully",
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    res.status(200).json({
      userId,
      unreadCount: count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch unread count",
      error: error.message,
    });
  }
};

// Mark one notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification =
      await Notification.findByIdAndUpdate(
        notificationId,
        {
          isRead: true,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// Mark every notification of one user as read
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Notification.updateMany(
      {
        recipientId: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

// Delete one notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification =
      await Notification.findByIdAndDelete(
        notificationId
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

module.exports = {
  createNotificationRecord,
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};