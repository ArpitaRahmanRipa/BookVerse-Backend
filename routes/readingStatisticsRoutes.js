const express = require("express");

const {
  getReadingStatistics,
} = require("../controllers/readingStatisticsController");

const router = express.Router();

router.get("/:userId", getReadingStatistics);

module.exports = router;
