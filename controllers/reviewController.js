const mongoose = require("mongoose");

const Review = require("../models/Review");

const {
  createNotificationRecord,
} = require("./notificationController");


// ==========================================
// FIND REVIEW SAFELY
// ==========================================

const findReviewSafely = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return await Review.findById(id);

  } catch (error) {

    console.error(
      "Find review error:",
      error
    );

    return null;
  }
};


// ==========================================
// 1. CREATE REVIEW
// POST /api/reviews
// Protected
// ==========================================

const createReview = async (
  req,
  res
) => {
  try {
    const {
      googleBookId,
      openLibraryId,
      bookTitle,
      rating,
      reviewText,
    } = req.body;

    const reviewerId =
      req.user.userId;

    const reviewerName =
      req.user.name;


    if (
      !bookTitle ||
      rating === undefined ||
      rating === null ||
      !reviewText
    ) {
      return res.status(400).json({
        success: false,

        message:
          "bookTitle, rating and reviewText are required",
      });
    }


    const numericRating =
      Number(rating);


    if (
      Number.isNaN(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Rating must be between 1 and 5",
      });
    }


    const review =
      await Review.create({
        googleBookId:
          googleBookId || null,

        openLibraryId:
          openLibraryId || null,

        bookTitle:
          bookTitle.trim(),

        reviewerId,

        reviewerName,

        rating:
          numericRating,

        reviewText:
          reviewText.trim(),

        likedBy: [],

        comments: [],
      });


    return res.status(201).json({
      success: true,

      message:
        "Review created successfully",

      data:
        review,
    });

  } catch (error) {

    console.error(
      "Create review error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create review",

      error:
        error.message,
    });
  }
};


// ==========================================
// 2. GET REVIEWS FOR BOOK
// GET /api/reviews/book/:bookId
// Public
// ==========================================

const getReviewsForBook = async (
  req,
  res
) => {
  try {
    const {
      bookId,
    } = req.params;


    const reviews =
      await Review.find({
        $or: [
          {
            googleBookId:
              bookId,
          },
          {
            openLibraryId:
              bookId,
          },
        ],
      })
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({
      success: true,

      count:
        reviews.length,

      data:
        reviews,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,

      message:
        "Failed to get reviews",

      error:
        error.message,
    });
  }
};


// ==========================================
// 3. LIKE / UNLIKE REVIEW
// POST /api/reviews/:id/like
// Protected
// ==========================================

const toggleLikeReview = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId;

    const userName =
      req.user.name;


    const review =
      await findReviewSafely(
        req.params.id
      );


    if (!review) {
      return res.status(404).json({
        success: false,

        message:
          "Review not found",
      });
    }


    const alreadyLiked =
      review.likedBy.includes(
        userId
      );


    if (alreadyLiked) {

      review.likedBy =
        review.likedBy.filter(
          (id) =>
            id !== userId
        );

    } else {

      review.likedBy.push(
        userId
      );


      // ==============================
      // Create Like Notification
      // ==============================

      if (
        review.reviewerId !==
        userId
      ) {
        await createNotificationRecord({
          recipientId:
            review.reviewerId,

          actorId:
            userId,

          actorName:
            userName,

          type:
            "review_like",

          message:
            `${userName} liked your review of "${review.bookTitle}".`,

          relatedId:
            review._id.toString(),

          relatedType:
            "review",

          link:
            "/notifications",
        });
      }
    }


    await review.save();


    return res.status(200).json({
      success: true,

      message:
        alreadyLiked
          ? "Review unliked"
          : "Review liked",

      data:
        review,
    });

  } catch (error) {

    console.error(
      "Like error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to like review",

      error:
        error.message,
    });
  }
};


// ==========================================
// 4. ADD COMMENT
// POST /api/reviews/:id/comments
// Protected
// ==========================================

const addComment = async (
  req,
  res
) => {
  try {
    const {
      text,
    } = req.body;


    const commenterId =
      req.user.userId;

    const commenterName =
      req.user.name;


    if (
      !text ||
      !text.trim()
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Comment text is required",
      });
    }


    const review =
      await findReviewSafely(
        req.params.id
      );


    if (!review) {
      return res.status(404).json({
        success: false,

        message:
          "Review not found",
      });
    }


    review.comments.push({
      commenterId,

      commenterName,

      text:
        text.trim(),

      reviewId:
        review._id,
    });


    await review.save();


    // ==============================
    // Create Comment Notification
    // ==============================

    if (
      review.reviewerId !==
      commenterId
    ) {
      await createNotificationRecord({
        recipientId:
          review.reviewerId,

        actorId:
          commenterId,

        actorName:
          commenterName,

        type:
          "review_comment",

        message:
          `${commenterName} commented on your review of "${review.bookTitle}".`,

        relatedId:
          review._id.toString(),

        relatedType:
          "review",

        link:
          "/notifications",
      });
    }


    return res.status(201).json({
      success: true,

      message:
        "Comment added successfully",

      data:
        review,
    });

  } catch (error) {

    console.error(
      "Comment error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to add comment",

      error:
        error.message,
    });
  }
};


// ==========================================
// 5. DELETE OWN COMMENT
// DELETE /api/reviews/:reviewId/comments/:commentId
// Protected
// ==========================================

const deleteOwnComment = async (
  req,
  res
) => {
  try {
    const {
      reviewId,
      commentId,
    } = req.params;


    const userId =
      req.user.userId;


    const review =
      await findReviewSafely(
        reviewId
      );


    if (!review) {
      return res.status(404).json({
        success: false,

        message:
          "Review not found",
      });
    }


    const comment =
      review.comments.id(
        commentId
      );


    if (!comment) {
      return res.status(404).json({
        success: false,

        message:
          "Comment not found",
      });
    }


    if (
      comment.commenterId !==
      userId
    ) {
      return res.status(403).json({
        success: false,

        message:
          "You can only delete your own comment",
      });
    }


    comment.deleteOne();

    await review.save();


    return res.status(200).json({
      success: true,

      message:
        "Comment deleted successfully",

      data:
        review,
    });

  } catch (error) {

    console.error(
      "Delete comment error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete comment",

      error:
        error.message,
    });
  }
};


// ==========================================
// 6. MODERATOR DELETE COMMENT
// DELETE /api/reviews/:reviewId/comments/:commentId/moderator
// Community Moderator / Admin Only
// ==========================================

const moderatorDeleteComment = async (
  req,
  res
) => {
  try {
    const {
      reviewId,
      commentId,
    } = req.params;


    const review =
      await findReviewSafely(
        reviewId
      );


    if (!review) {
      return res.status(404).json({
        success: false,

        message:
          "Review not found",
      });
    }


    const comment =
      review.comments.id(
        commentId
      );


    if (!comment) {
      return res.status(404).json({
        success: false,

        message:
          "Comment not found",
      });
    }


    comment.deleteOne();

    await review.save();


    return res.status(200).json({
      success: true,

      message:
        "Comment removed by moderator",

      moderator: {
        userId:
          req.user.userId,

        name:
          req.user.name,

        role:
          req.user.role,
      },

      data:
        review,
    });

  } catch (error) {

    console.error(
      "Moderator delete comment error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to remove comment",

      error:
        error.message,
    });
  }
};


// ==========================================
// 7. DELETE OWN REVIEW
// DELETE /api/reviews/:reviewId
// Protected
// ==========================================

const deleteOwnReview = async (
  req,
  res
) => {
  try {
    const {
      reviewId,
    } = req.params;


    const userId =
      req.user.userId;


    const review =
      await findReviewSafely(
        reviewId
      );


    if (!review) {
      return res.status(404).json({
        success: false,

        message:
          "Review not found",
      });
    }


    if (
      review.reviewerId !==
      userId
    ) {
      return res.status(403).json({
        success: false,

        message:
          "You can only delete your own review",
      });
    }


    await Review.deleteOne({
      _id:
        review._id,
    });


    return res.status(200).json({
      success: true,

      message:
        "Review deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete review error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete review",

      error:
        error.message,
    });
  }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  createReview,
  getReviewsForBook,
  toggleLikeReview,
  addComment,
  deleteOwnComment,
  moderatorDeleteComment,
  deleteOwnReview,
};