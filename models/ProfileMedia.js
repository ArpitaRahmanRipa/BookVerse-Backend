const mongoose = require("mongoose");

const listCoverSchema = new mongoose.Schema(
  {
    listId: {
      type: String,
      required: true,
      trim: true,
    },

    listTitle: {
      type: String,
      default: "",
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      default: "",
    },
  },
  {
    _id: true,
  }
);

const profileMediaSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    profilePictureUrl: {
      type: String,
      default: "",
    },

    profilePicturePublicId: {
      type: String,
      default: "",
    },

    listCoverImages: {
      type: [listCoverSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ProfileMedia",
  profileMediaSchema
);
