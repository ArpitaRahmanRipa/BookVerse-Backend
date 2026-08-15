const ReadingProgress = require("../models/ReadingProgress");

// Create reading progress record
const createReadingProgress = async (req, res) => {
  try {
    const {
      userId,
      bookId,
      bookTitle,
      author,
      bookCover,
      totalPages,
      currentPage,
      status,
      startDate,
    } = req.body;

    if (!userId || !bookTitle || !totalPages) {
      return res.status(400).json({
        message:
          "userId, bookTitle, and totalPages are required",
      });
    }

    if (
      currentPage !== undefined &&
      currentPage > totalPages
    ) {
      return res.status(400).json({
        message:
          "Current page cannot be greater than total pages",
      });
    }

    const progress = await ReadingProgress.create({
      userId,
      bookId,
      bookTitle,
      author,
      bookCover,
      totalPages,
      currentPage: currentPage || 0,
      status: status || "Currently Reading",
      startDate: startDate || new Date(),
    });

    res.status(201).json({
      message:
        "Reading progress created successfully",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create reading progress",
      error: error.message,
    });
  }
};

// Get all progress records of a user
const getReadingProgress = async (req, res) => {
  try {
    const progressList = await ReadingProgress.find({
      userId: req.params.userId,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      message:
        "Reading progress list fetched successfully",
      data: progressList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reading progress",
      error: error.message,
    });
  }
};

// Get one progress record
const getSingleReadingProgress = async (req, res) => {
  try {
    const progress = await ReadingProgress.findById(
      req.params.progressId
    );

    if (!progress) {
      return res.status(404).json({
        message: "Reading progress not found",
      });
    }

    res.status(200).json({
      message:
        "Reading progress fetched successfully",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reading progress",
      error: error.message,
    });
  }
};

// Update reading progress
const updateReadingProgress = async (req, res) => {
  try {
    const progress = await ReadingProgress.findById(
      req.params.progressId
    );

    if (!progress) {
      return res.status(404).json({
        message: "Reading progress not found",
      });
    }

    const {
      currentPage,
      status,
      startDate,
      finishDate,
      rating,
    } = req.body;

    if (
      currentPage !== undefined &&
      currentPage > progress.totalPages
    ) {
      return res.status(400).json({
        message:
          "Current page cannot be greater than total pages",
      });
    }

    if (currentPage !== undefined) {
      progress.currentPage = currentPage;
    }

    if (status !== undefined) {
      progress.status = status;
    }

    if (startDate !== undefined) {
      progress.startDate = startDate;
    }

    if (finishDate !== undefined) {
      progress.finishDate = finishDate;
    }

    if (rating !== undefined) {
      progress.rating = rating;
    }

    if (status === "Finished") {
      progress.currentPage = progress.totalPages;

      if (!progress.finishDate) {
        progress.finishDate = new Date();
      }
    }

    const updatedProgress = await progress.save();

    res.status(200).json({
      message:
        "Reading progress updated successfully",
      data: updatedProgress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update reading progress",
      error: error.message,
    });
  }
};

// Add diary entry
const addDiaryEntry = async (req, res) => {
  try {
    const { note, pageNumber, visibility } = req.body;

    if (!note) {
      return res.status(400).json({
        message: "Diary note is required",
      });
    }

    const progress = await ReadingProgress.findById(
      req.params.progressId
    );

    if (!progress) {
      return res.status(404).json({
        message: "Reading progress not found",
      });
    }

    progress.diaryEntries.push({
      note,
      pageNumber:
        pageNumber !== undefined
          ? pageNumber
          : progress.currentPage,
      visibility: visibility || "Private",
    });

    const updatedProgress = await progress.save();

    res.status(201).json({
      message: "Diary entry added successfully",
      data: updatedProgress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add diary entry",
      error: error.message,
    });
  }
};

// Delete diary entry
const deleteDiaryEntry = async (req, res) => {
  try {
    const progress = await ReadingProgress.findById(
      req.params.progressId
    );

    if (!progress) {
      return res.status(404).json({
        message: "Reading progress not found",
      });
    }

    const diaryEntry = progress.diaryEntries.id(
      req.params.entryId
    );

    if (!diaryEntry) {
      return res.status(404).json({
        message: "Diary entry not found",
      });
    }

    diaryEntry.deleteOne();

    await progress.save();

    res.status(200).json({
      message: "Diary entry deleted successfully",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete diary entry",
      error: error.message,
    });
  }
};

// Delete reading progress record
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
      message:
        "Reading progress deleted successfully",
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
  getSingleReadingProgress,
  updateReadingProgress,
  addDiaryEntry,
  deleteDiaryEntry,
  deleteReadingProgress,
};