const ReadingProgress = require("../models/ReadingProgress");
const Notification = require("../models/Notification");

const {
  createNotificationRecord,
} = require("./notificationController");

// Prevent two simultaneous reminder checks
// for the same user.
const reminderChecksInProgress = new Set();

// ==============================
// Create reading progress record
// ==============================

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

// ==============================
// Get all progress records of user
// ==============================

const getReadingProgress = async (req, res) => {
  try {
    const progressList = await ReadingProgress.find({
      userId: req.params.userId,
    }).sort({
      updatedAt: -1,
    });

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

// ==============================
// Get one reading progress record
// ==============================

const getSingleReadingProgress = async (
  req,
  res
) => {
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

// ==============================
// Update reading progress
// ==============================

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

// ==============================
// Add diary entry
// ==============================

const addDiaryEntry = async (req, res) => {
  try {
    const {
      note,
      pageNumber,
      visibility,
    } = req.body;

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

// ==============================
// Delete diary entry
// ==============================

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

// ==============================
// Delete reading progress record
// ==============================

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

// ==============================
// Check reading reminders
// ==============================

const checkReadingReminders = async (req, res) => {
  const { userId } = req.params;

  // ==============================
  // Validate user
  // ==============================

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  // ==============================
  // Prevent simultaneous checks
  // ==============================

  if (reminderChecksInProgress.has(userId)) {
    return res.status(200).json({
      message:
        "Reading reminder check already in progress",
      inactiveBooks: 0,
      remindersCreated: 0,
    });
  }

  reminderChecksInProgress.add(userId);

  try {
    // Normal reminder threshold is 7 days.
    const reminderDays = Number(
      process.env.READING_REMINDER_DAYS || 7
    );

    const reminderCutoff = new Date(
      Date.now() -
        reminderDays *
          24 *
          60 *
          60 *
          1000
    );

    // ==============================
    // Find inactive books
    // ==============================

    const inactiveProgress =
      await ReadingProgress.find({
        userId,

        status: {
          $in: [
            "Currently Reading",
            "Paused",
          ],
        },

        updatedAt: {
          $lte: reminderCutoff,
        },
      });

    let remindersCreated = 0;

    // ==============================
    // Prevent repeat within 24 hours
    // ==============================

    const duplicateCutoff = new Date(
      Date.now() -
        24 *
          60 *
          60 *
          1000
    );

    for (const progress of inactiveProgress) {
      const progressId =
        progress._id.toString();

      const existingReminder =
        await Notification.findOne({
          recipientId: userId,

          type: "reading_reminder",

          relatedId: progressId,

          createdAt: {
            $gte: duplicateCutoff,
          },
        });

      if (existingReminder) {
        continue;
      }

      // ==============================
      // Create Reminder
      // ==============================

      await createNotificationRecord({
        recipientId: userId,

        type: "reading_reminder",

        message:
          `You have not updated your reading progress for "${progress.bookTitle}" recently. Time to continue reading!`,

        relatedId: progressId,

        relatedType:
          "reading_progress",

        link:
          "/reading-progress",
      });

      remindersCreated += 1;
    }

    return res.status(200).json({
      message:
        "Reading reminder check completed",

      inactiveBooks:
        inactiveProgress.length,

      remindersCreated,
    });

  } catch (error) {

    return res.status(500).json({
      message:
        "Failed to check reading reminders",

      error:
        error.message,
    });

  } finally {

    // VERY IMPORTANT:
    // always release the lock
    reminderChecksInProgress.delete(
      userId
    );

  }
};

// ==============================
// Export controller functions
// ==============================

module.exports = {
  createReadingProgress,
  getReadingProgress,
  getSingleReadingProgress,
  updateReadingProgress,
  addDiaryEntry,
  deleteDiaryEntry,
  deleteReadingProgress,
  checkReadingReminders,
};