const express = require("express");

const {
  generateRecommendations,
  getUserRecommendations,
  getSingleRecommendation,
} = require("../controllers/recommendationController");

const router = express.Router();

router.post("/generate", generateRecommendations);

router.get(
  "/user/:userId",
  getUserRecommendations
);

router.get(
  "/:recommendationId",
  getSingleRecommendation
);

module.exports = router;
