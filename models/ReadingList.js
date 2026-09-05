const mongoose = require("mongoose");

const listBookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    authors: {
      type: [String],
      default: [],
    },

    coverImage: {
      type: String,
      default: "",
    },

    rank: {
      type: Number,
      required: true,
      min: 1,
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  }
);

const readingListSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    books: {
      type: [listBookSchema],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    likedBy: {
      type: [String],
      default: [],
    },

    savedBy: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ReadingList",
  readingListSchema
);