const express = require("express");

const router = express.Router();

const {
  createReview,
  getReviewsForBook,
  toggleLikeReview,
  addComment,
  deleteOwnComment,
  moderatorDeleteComment,
  deleteOwnReview,
} = require(
  "../controllers/reviewController"
);

const {
  protect,
  allowRoles,
} = require(
  "../middleware/authMiddleware"
);


// ==========================================
// CREATE REVIEW
// Logged-in users only
// POST /api/reviews
// ==========================================

router.post(
  "/",
  protect,
  createReview
);


// ==========================================
// GET REVIEWS FOR A BOOK
// Public
// GET /api/reviews/book/:bookId
// ==========================================

router.get(
  "/book/:bookId",
  getReviewsForBook
);


// ==========================================
// LIKE / UNLIKE REVIEW
// Logged-in users only
// POST /api/reviews/:id/like
// ==========================================

router.post(
  "/:id/like",
  protect,
  toggleLikeReview
);


// ==========================================
// ADD COMMENT
// Logged-in users only
// POST /api/reviews/:id/comments
// ==========================================

router.post(
  "/:id/comments",
  protect,
  addComment
);


// ==========================================
// DELETE OWN COMMENT
// Logged-in users only
// DELETE /api/reviews/:reviewId/comments/:commentId
// ==========================================

router.delete(
  "/:reviewId/comments/:commentId",
  protect,
  deleteOwnComment
);


// ==========================================
// MODERATOR DELETE COMMENT
// Community Moderator / Admin only
// DELETE /api/reviews/:reviewId/comments/:commentId/moderator
// ==========================================

router.delete(
  "/:reviewId/comments/:commentId/moderator",
  protect,
  allowRoles(
    "Community Moderator",
    "Admin"
  ),
  moderatorDeleteComment
);


// ==========================================
// DELETE OWN REVIEW
// Logged-in users only
// DELETE /api/reviews/:reviewId
// ==========================================

router.delete(
  "/:reviewId",
  protect,
  deleteOwnReview
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;