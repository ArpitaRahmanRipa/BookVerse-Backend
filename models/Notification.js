const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // The user who will receive the notification
    recipientId: {
      type: String,
      required: true,
      trim: true,
    },

    // The user who caused the notification
    // Example: the person who followed you
    actorId: {
      type: String,
      default: "",
      trim: true,
    },

    actorName: {
      type: String,
      default: "",
      trim: true,
    },

    // What kind of notification it is
    type: {
      type: String,
      required: true,
      enum: [
        "follow",
        "review_like",
        "review_comment",
        "list_like",
        "reading_reminder",
        "moderation_update",
      ],
    },

    // Text shown to the user
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // ID of related review/list/etc.
    relatedId: {
      type: String,
      default: "",
    },

    relatedType: {
      type: String,
      enum: [
        "user",
        "review",
        "reading_list",
        "reading_progress",
        "moderation",
        "system",
        "",
      ],
      default: "",
    },

    // Frontend location the notification can open
    link: {
      type: String,
      default: "",
    },

    // Has the user opened/read it?
    isRead: {
      type: Boolean,
      default: false,
    },

    // We can use this later when adding email alerts
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Helps us quickly load a user's newest notifications
notificationSchema.index({
  recipientId: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipientId: 1,
  isRead: 1,
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);