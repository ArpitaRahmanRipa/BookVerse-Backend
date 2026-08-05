const mongoose = require("mongoose");

const readingProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    bookTitle: {
      type: String,
      required: true,
    },

    author: {
      type: String,
    },

    totalPages: {
      type: Number,
    },

    currentPage: {
      type: Number,
    },

    status: {
      type: String,
      default: "Currently Reading",
    },

    startDate: {
      type: String,
    },

    finishDate: {
      type: String,
    },

    diaryNote: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ReadingProgress",
  readingProgressSchema
);