const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },

    targetUserId: {
      type: String,
      required: true,
      trim: true,
    },

    targetName: {
      type: String,
      trim: true,
      default: "",
    },

    targetUsername: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from following
// the same reader more than once.
followSchema.index(
  {
    userId: 1,
    targetUserId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Follow",
  followSchema
);