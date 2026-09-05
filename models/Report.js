const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // ==============================
    // Who submitted the report
    // ==============================

    reporterId: {
      type: String,
      required: true,
      trim: true,
    },

    reporterName: {
      type: String,
      default: "",
      trim: true,
    },

    // ==============================
    // What was reported
    // ==============================

    targetType: {
      type: String,
      required: true,
      enum: [
        "review",
        "comment",
        "reading_list",
        "profile",
      ],
    },

    targetId: {
      type: String,
      required: true,
      trim: true,
    },

    // Owner of the reported content.
    // We can notify this user after
    // a moderation decision.
    targetOwnerId: {
      type: String,
      default: "",
      trim: true,
    },

    targetOwnerName: {
      type: String,
      default: "",
      trim: true,
    },

    // Useful text for the moderation dashboard
    targetTitle: {
      type: String,
      default: "",
      trim: true,
    },

    // ==============================
    // Why it was reported
    // ==============================

    reason: {
      type: String,
      required: true,
      enum: [
        "Spam",
        "Harassment",
        "Hate Speech",
        "Inappropriate Content",
        "False Information",
        "Spoiler",
        "Other",
      ],
    },

    details: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    // ==============================
    // Moderation status
    // ==============================

    status: {
      type: String,
      enum: [
        "Pending",
        "Dismissed",
        "Hidden",
        "Warned",
        "Forwarded",
      ],
      default: "Pending",
    },

    // Moderator who handled the report
    moderatorId: {
      type: String,
      default: "",
      trim: true,
    },

    moderatorName: {
      type: String,
      default: "",
      trim: true,
    },

    // Optional explanation from moderator
    moderatorNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Newest pending reports are commonly needed
// by the moderation dashboard.
reportSchema.index({
  status: 1,
  createdAt: -1,
});

// Find reports submitted by one reader.
reportSchema.index({
  reporterId: 1,
  createdAt: -1,
});

// Find reports involving one content owner.
reportSchema.index({
  targetOwnerId: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Report",
  reportSchema
);