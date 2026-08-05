const express = require("express");

const {
  createReadingProgress,
  getReadingProgress,
  updateReadingProgress,
  deleteReadingProgress,
} = require("../controllers/readingProgressController");

const router = express.Router();

router.post("/", createReadingProgress);

router.get("/:userId", getReadingProgress);

router.put("/:progressId", updateReadingProgress);

router.delete("/:progressId", deleteReadingProgress);

module.exports = router;