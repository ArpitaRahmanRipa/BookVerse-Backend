const express = require("express");

const {
  getYearlyReadingWrapped,
} = require("../controllers/readingWrappedController");

const router = express.Router();

// Get yearly reading wrapped for one user
// Example:
// GET /api/reading-wrapped/21201436?year=2026

router.get(
  "/user/:userId",
  getYearlyReadingWrapped
);

module.exports = router;