const ReadingProgress = require("../models/ReadingProgress");

// Create reading progress and diary entry
const createReadingProgress = async (req, res) => {
  try {
    const progress = new ReadingProgress(req.body);
    const savedProgress = await progress.save();

    res.status(201).json({
      message:
        "Reading progress and diary entry created successfully",
      data: savedProgress,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create reading progress",
      error: error.message,
    });
  }
};

// Get all reading progress entries of a user
const getReadingProgress = async (req, res) => {
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
};

// Update reading progress or diary note
const updateReadingProgress = async (req, res) => {
  try {
    const updatedProgress =
      await ReadingProgress.findByIdAndUpdate(
        req.params.progressId,
        req.body,
        {
          new: true,
        }
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
};

// Delete reading progress entry
const deleteReadingProgress = async (req, res) => {
  try {
    const deletedProgress =
      await ReadingProgress.findByIdAndDelete(
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
};

module.exports = {
  createReadingProgress,
  getReadingProgress,
  updateReadingProgress,
  deleteReadingProgress,
};