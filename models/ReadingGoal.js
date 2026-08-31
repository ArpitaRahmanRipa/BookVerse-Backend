const mongoose = require("mongoose");

const readingGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    goalType: {
      type: String,
      enum: ["yearly", "monthly"],
      required: true,
    },

    targetType: {
      type: String,
      enum: ["books", "pages"],
      required: true,
    },

    targetValue: {
      type: Number,
      required: true,
      min: 1,
    },

    year: {
      type: Number,
      required: true,
    },

    month: {
      type: Number,
      min: 1,
      max: 12,
    },

    status: {
      type: String,
      enum: ["active", "completed", "missed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ReadingGoal",
  readingGoalSchema
);
