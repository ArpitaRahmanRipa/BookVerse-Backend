const express = require("express");

const router = express.Router();

const {
    createReview,
    getReviewsForBook,
    toggleLikeReview,
    addComment,
    deleteOwnComment,
    moderatorDeleteComment,
    deleteOwnReview
} = require("../controllers/reviewController");


// ==========================================
// CREATE REVIEW
// POST /api/reviews
// ==========================================

router.post(
    "/",
    createReview
);


// ==========================================
// GET REVIEWS FOR A BOOK
// GET /api/reviews/book/:bookId
// ==========================================

router.get(
    "/book/:bookId",
    getReviewsForBook
);


// ==========================================
// LIKE / UNLIKE REVIEW
// POST /api/reviews/:id/like
// ==========================================

router.post(
    "/:id/like",
    toggleLikeReview
);


// ==========================================
// ADD COMMENT
// POST /api/reviews/:id/comments
// ==========================================

router.post(
    "/:id/comments",
    addComment
);


// ==========================================
// DELETE OWN COMMENT
// DELETE /api/reviews/:reviewId/comments/:commentId
// ==========================================

router.delete(
    "/:reviewId/comments/:commentId",
    deleteOwnComment
);


// ==========================================
// MODERATOR DELETE COMMENT
// DELETE /api/reviews/:reviewId/comments/:commentId/moderator
// ==========================================

router.delete(
    "/:reviewId/comments/:commentId/moderator",
    moderatorDeleteComment
);


// ==========================================
// DELETE OWN REVIEW
// DELETE /api/reviews/:reviewId
// ==========================================

router.delete(
    "/:reviewId",
    deleteOwnReview
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;