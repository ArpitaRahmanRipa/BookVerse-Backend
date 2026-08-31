const express = require("express");

const {
  createReadingGoal,
  getUserReadingGoals,
  getSingleReadingGoal,
  updateReadingGoal,
  deleteReadingGoal,
} = require("../controllers/readingGoalController");

const router = express.Router();

router.post("/", createReadingGoal);

router.get(
  "/user/:userId",
  getUserReadingGoals
);

router.get("/:goalId", getSingleReadingGoal);

router.put("/:goalId", updateReadingGoal);

router.delete("/:goalId", deleteReadingGoal);

module.exports = router;
