import axios from "axios";


// ==========================================
// REVIEW API BASE URL
// ==========================================

const API_BASE_URL =
  "http://127.0.0.1:9208/api/reviews";


// ==========================================
// GET REVIEWS FOR A BOOK
// GET /api/reviews/book/:bookId
// ==========================================

export const getReviewsForBook = async (
  bookId
) => {

  const response = await axios.get(
    `${API_BASE_URL}/book/${bookId}`
  );

  return response.data;
};


// ==========================================
// CREATE REVIEW
// POST /api/reviews
// ==========================================

export const createReview = async (
  reviewData
) => {

  const response = await axios.post(
    API_BASE_URL,
    reviewData
  );

  return response.data;
};


// ==========================================
// DELETE OWN REVIEW
// DELETE /api/reviews/:reviewId
// ==========================================

export const deleteOwnReview = async (
  reviewId,
  userId
) => {

  const response = await axios.delete(
    `${API_BASE_URL}/${reviewId}`,
    {
      data: {
        userId,
      },
    }
  );

  return response.data;
};


// ==========================================
// LIKE / UNLIKE REVIEW
// POST /api/reviews/:id/like
// ==========================================

export const toggleLikeReview = async (
  reviewId,
  userId
) => {

  const response = await axios.post(
    `${API_BASE_URL}/${reviewId}/like`,
    {
      userId,
    }
  );

  return response.data;
};


// ==========================================
// ADD COMMENT
// POST /api/reviews/:id/comments
// ==========================================

export const addComment = async (
  reviewId,
  commentData
) => {

  const response = await axios.post(
    `${API_BASE_URL}/${reviewId}/comments`,
    commentData
  );

  return response.data;
};


// ==========================================
// DELETE OWN COMMENT
// DELETE /api/reviews/:reviewId/comments/:commentId
// ==========================================

export const deleteOwnComment = async (
  reviewId,
  commentId,
  userId
) => {

  const response = await axios.delete(
    `${API_BASE_URL}/${reviewId}/comments/${commentId}`,
    {
      data: {
        userId,
      },
    }
  );

  return response.data;
};


// ==========================================
// MODERATOR DELETE COMMENT
// DELETE /api/reviews/:reviewId/comments/:commentId/moderator
// ==========================================

export const moderatorDeleteComment = async (
  reviewId,
  commentId,
  moderatorId
) => {

  const response = await axios.delete(
    `${API_BASE_URL}/${reviewId}/comments/${commentId}/moderator`,
    {
      data: {
        moderatorId,
      },
    }
  );

  return response.data;
};