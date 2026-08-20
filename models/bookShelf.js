const mongoose = require("mongoose");

const bookShelfSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    bookId: {
      type: String,
      required: true,
    },

    bookTitle: {
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

    shelf: {
      type: String,
      enum: [
        "Want to Read",
        "Currently Reading",
        "Read",
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "BookShelf",
  bookShelfSchema
);