const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // This string ID will be used by the existing
    // BookVerse modules such as ReadingProgress,
    // Follow, Notifications, Media, etc.
    userId: {
      type: String,
      unique: true,
      trim: true,
      immutable: true,
      default: () =>
        new mongoose.Types.ObjectId().toString(),
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "Reader",
        "Community Moderator",
        "Admin",
      ],
      default: "Reader",
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    favoriteGenres: {
      type: [String],
      default: [],
    },

    readingGoal: {
      type: Number,
      default: 0,
      min: 0,
    },

    privacy: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);