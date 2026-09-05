const express = require("express");

const {
  createReadingProgress,
  getReadingProgress,
  getSingleReadingProgress,
  updateReadingProgress,
  addDiaryEntry,
  deleteDiaryEntry,
  deleteReadingProgress,
  checkReadingReminders,
} = require("../controllers/readingProgressController");

const router = express.Router();

// ==============================
// Create reading progress
// ==============================

router.post("/", createReadingProgress);

// ==============================
// Get all progress for one user
// ==============================

router.get(
  "/user/:userId",
  getReadingProgress
);

// ==============================
// Check automatic reading reminders
// ==============================

router.post(
  "/user/:userId/check-reminders",
  checkReadingReminders
);

// ==============================
// Get one reading progress record
// ==============================

router.get(
  "/:progressId",
  getSingleReadingProgress
);

// ==============================
// Update reading progress
// ==============================

router.put(
  "/:progressId",
  updateReadingProgress
);

// ==============================
// Add diary entry
// ==============================

router.post(
  "/:progressId/diary",
  addDiaryEntry
);

// ==============================
// Delete diary entry
// ==============================

router.delete(
  "/:progressId/diary/:entryId",
  deleteDiaryEntry
);

// ==============================
// Delete reading progress
// ==============================

router.delete(
  "/:progressId",
  deleteReadingProgress
);

module.exports = router;