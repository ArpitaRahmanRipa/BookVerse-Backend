const mongoose = require("mongoose");

const diaryEntrySchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true,
      trim: true,
    },

    pageNumber: {
      type: Number,
      min: 0,
    },

    visibility: {
      type: String,
      enum: ["Private", "Public"],
      default: "Private",
    },

    entryDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

const readingProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },

    bookId: {
      type: String,
      default: "",
      trim: true,
    },

    bookTitle: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      default: "",
      trim: true,
    },

    bookCover: {
      type: String,
      default: "",
    },

    totalPages: {
      type: Number,
      required: true,
      min: 1,
    },

    currentPage: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Want to Read",
        "Currently Reading",
        "Paused",
        "Dropped",
        "Finished",
      ],
      default: "Currently Reading",
    },

    startDate: {
      type: Date,
      default: null,
    },

    finishDate: {
      type: Date,
      default: null,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },

    diaryEntries: {
      type: [diaryEntrySchema],
      default: [],
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