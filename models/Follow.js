const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    targetUserId: {
      type: String,
      required: true,
    },

    targetName: {
      type: String,
    },

    targetUsername: {
      type: String,
    },

    favoriteGenres: {
      type: [String],
    },

    booksRead: {
      type: Number,
    },

    targetFollowers: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

followSchema.index(
  {
    userId: 1,
    targetUserId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Follow", followSchema);