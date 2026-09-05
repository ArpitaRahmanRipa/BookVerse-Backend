import axios from "axios";


// ==========================================
// API BASE URL
// ==========================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:9208/api";

const REVIEW_API_URL =
  `${API_BASE_URL}/reviews`;


// ==========================================
// AUTH HEADER HELPER
// ==========================================

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


// ==========================================
// GET REVIEWS FOR A BOOK
// Public
// GET /api/reviews/book/:bookId
// ==========================================

export const getReviewsForBook = async (
  bookId
) => {
  const response = await axios.get(
    `${REVIEW_API_URL}/book/${bookId}`
  );

  return response.data;
};


// ==========================================
// CREATE REVIEW
// Protected
// POST /api/reviews
// ==========================================

export const createReview = async (
  reviewData,
  token
) => {
  const response = await axios.post(
    REVIEW_API_URL,
    reviewData,
    authConfig(token)
  );

  return response.data;
};


// ==========================================
// DELETE OWN REVIEW
// Protected
// DELETE /api/reviews/:reviewId
// ==========================================

export const deleteOwnReview = async (
  reviewId,
  token
) => {
  const response = await axios.delete(
    `${REVIEW_API_URL}/${reviewId}`,
    authConfig(token)
  );

  return response.data;
};


// ==========================================
// LIKE / UNLIKE REVIEW
// Protected
// POST /api/reviews/:id/like
// ==========================================

export const toggleLikeReview = async (
  reviewId,
  token
) => {
  const response = await axios.post(
    `${REVIEW_API_URL}/${reviewId}/like`,
    {},
    authConfig(token)
  );

  return response.data;
};


// ==========================================
// ADD COMMENT
// Protected
// POST /api/reviews/:id/comments
// ==========================================

export const addComment = async (
  reviewId,
  text,
  token
) => {
  const response = await axios.post(
    `${REVIEW_API_URL}/${reviewId}/comments`,
    {
      text,
    },
    authConfig(token)
  );

  return response.data;
};


// ==========================================
// DELETE OWN COMMENT
// Protected
// DELETE /api/reviews/:reviewId/comments/:commentId
// ==========================================

export const deleteOwnComment = async (
  reviewId,
  commentId,
  token
) => {
  const response = await axios.delete(
    `${REVIEW_API_URL}/${reviewId}/comments/${commentId}`,
    authConfig(token)
  );

  return response.data;
};


// ==========================================
// MODERATOR DELETE COMMENT
// Community Moderator / Admin only
// DELETE /api/reviews/:reviewId/comments/:commentId/moderator
// ==========================================

export const moderatorDeleteComment = async (
  reviewId,
  commentId,
  token
) => {
  const response = await axios.delete(
    `${REVIEW_API_URL}/${reviewId}/comments/${commentId}/moderator`,
    authConfig(token)
  );

  return response.data;
};