const mongoose = require("mongoose");

const recommendedBookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      default: "",
      trim: true,
    },

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    genre: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  }
);

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },

    prompt: {
      type: String,
      default: "",
      trim: true,
    },

    mood: {
      type: String,
      default: "",
      trim: true,
    },

    difficulty: {
      type: String,
      default: "",
      trim: true,
    },

    favoriteGenres: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [recommendedBookSchema],
      default: [],
    },

    source: {
      type: String,
      enum: ["openai", "fallback"],
      default: "openai",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Recommendation",
  recommendationSchema
);
