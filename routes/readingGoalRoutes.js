const express = require("express");

const {
  createReadingGoal,
  getUserReadingGoals,
  getMyReadingGoals,
  getSingleReadingGoal,
  updateReadingGoal,
  deleteReadingGoal,
} = require("../controllers/readingGoalController");
const {
  authenticate,
  requireSelfOrAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, createReadingGoal);

router.get("/me", authenticate, getMyReadingGoals);

router.get(
  "/user/:userId",
  authenticate,
  requireSelfOrAdmin("userId"),
  getUserReadingGoals
);

router.get(
  "/:goalId",
  authenticate,
  getSingleReadingGoal
);

router.put(
  "/:goalId",
  authenticate,
  updateReadingGoal
);

router.delete(
  "/:goalId",
  authenticate,
  deleteReadingGoal
);

module.exports = router;
