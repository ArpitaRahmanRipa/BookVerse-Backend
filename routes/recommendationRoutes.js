const express = require("express");

const {
  generateRecommendations,
  getUserRecommendations,
  getMyRecommendations,
  getSingleRecommendation,
} = require("../controllers/recommendationController");
const {
  authenticate,
  requireSelfOrAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/generate",
  authenticate,
  generateRecommendations
);

router.get(
  "/me",
  authenticate,
  getMyRecommendations
);

router.get(
  "/user/:userId",
  authenticate,
  requireSelfOrAdmin("userId"),
  getUserRecommendations
);

router.get(
  "/:recommendationId",
  authenticate,
  getSingleRecommendation
);

module.exports = router;
