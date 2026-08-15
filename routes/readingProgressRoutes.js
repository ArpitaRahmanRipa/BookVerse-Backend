const express = require("express");

const {
  createReadingProgress,
  getReadingProgress,
  getSingleReadingProgress,
  updateReadingProgress,
  addDiaryEntry,
  deleteDiaryEntry,
  deleteReadingProgress,
} = require("../controllers/readingProgressController");

const router = express.Router();

router.post("/", createReadingProgress);

router.get("/user/:userId", getReadingProgress);

router.get("/:progressId", getSingleReadingProgress);

router.put("/:progressId", updateReadingProgress);

router.post(
  "/:progressId/diary",
  addDiaryEntry
);

router.delete(
  "/:progressId/diary/:entryId",
  deleteDiaryEntry
);

router.delete(
  "/:progressId",
  deleteReadingProgress
);

module.exports = router;