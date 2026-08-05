const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection failed");
    console.log(error.message);
  });

// Feature 01: Reading Progress and Diary Management
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
  { timestamps: true }
);

const ReadingProgress = mongoose.model(
  "ReadingProgress",
  readingProgressSchema
);

// Feature 02: Follow System and Reader Connections
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
  { timestamps: true }
);

followSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });

const Follow = mongoose.model("Follow", followSchema);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "BookVerse Member 3 API is running",
    port: process.env.PORT,
  });
});

// =====================================================
// APIs of Feature 01: Reading Progress and Diary
// =====================================================

// Create reading progress and diary entry
app.post("/api/reading-progress", async (req, res) => {
  try {
    const progress = new ReadingProgress(req.body);
    const savedProgress = await progress.save();

    res.status(201).json({
      message: "Reading progress and diary entry created successfully",
      data: savedProgress,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create reading progress",
      error: error.message,
    });
  }
});

// Get all reading progress entries of a user
app.get("/api/reading-progress/:userId", async (req, res) => {
  try {
    const progressList = await ReadingProgress.find({
      userId: req.params.userId,
    });

    res.status(200).json({
      message: "Reading progress list fetched successfully",
      data: progressList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reading progress",
      error: error.message,
    });
  }
});

// Update reading progress or diary note
app.put("/api/reading-progress/:progressId", async (req, res) => {
  try {
    const updatedProgress = await ReadingProgress.findByIdAndUpdate(
      req.params.progressId,
      req.body,
      { new: true }
    );

    if (!updatedProgress) {
      return res.status(404).json({
        message: "Reading progress not found",
      });
    }

    res.status(200).json({
      message: "Reading progress updated successfully",
      data: updatedProgress,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update reading progress",
      error: error.message,
    });
  }
});

// Delete reading progress entry
app.delete("/api/reading-progress/:progressId", async (req, res) => {
  try {
    const deletedProgress = await ReadingProgress.findByIdAndDelete(
      req.params.progressId
    );

    if (!deletedProgress) {
      return res.status(404).json({
        message: "Reading progress not found",
      });
    }

    res.status(200).json({
      message: "Reading progress deleted successfully",
      data: deletedProgress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete reading progress",
      error: error.message,
    });
  }
});

// =====================================================
// APIs of Feature 02: Follow System and Reader Connections
// =====================================================

// Follow a reader
app.post("/api/follow", async (req, res) => {
  try {
    const follow = new Follow(req.body);
    const savedFollow = await follow.save();

    res.status(201).json({
      message: "Reader followed successfully",
      data: savedFollow,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This reader is already followed",
      });
    }

    res.status(400).json({
      message: "Failed to follow reader",
      error: error.message,
    });
  }
});

// Get all readers followed by a user
app.get("/api/following/:userId", async (req, res) => {
  try {
    const followingList = await Follow.find({
      userId: req.params.userId,
    });

    res.status(200).json({
      message: "Following list fetched successfully",
      data: followingList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch following list",
      error: error.message,
    });
  }
});

// Get followers of a reader
app.get("/api/followers/:targetUserId", async (req, res) => {
  try {
    const followersList = await Follow.find({
      targetUserId: req.params.targetUserId,
    });

    res.status(200).json({
      message: "Followers list fetched successfully",
      data: followersList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch followers list",
      error: error.message,
    });
  }
});

// Unfollow a reader
app.delete("/api/follow/:userId/:targetUserId", async (req, res) => {
  try {
    const deletedFollow = await Follow.findOneAndDelete({
      userId: req.params.userId,
      targetUserId: req.params.targetUserId,
    });

    if (!deletedFollow) {
      return res.status(404).json({
        message: "Follow record not found",
      });
    }

    res.status(200).json({
      message: "Reader unfollowed successfully",
      data: deletedFollow,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to unfollow reader",
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 1436;

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});