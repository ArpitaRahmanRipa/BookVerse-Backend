import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import {
  addComment,
  createReview,
  deleteOwnComment,
  getReviewsForBook,
  moderatorDeleteComment,
  toggleLikeReview,
} from "../services/reviewApi";

import { getBookDetails } from "../services/bookApi";


// ======================================================
// TEMPORARY DEVELOPMENT USER
// Later replace these with the logged-in user's account.
// ======================================================

const CURRENT_USER_ID = "21201436";
const CURRENT_USER_NAME = "BookVerse Reader";

// For demonstration purposes.
// Later this should come from authentication/role data.
const CURRENT_USER_IS_MODERATOR = true;


// ======================================================
// REVIEW PAGE
// ======================================================

export default function Review() {

  const params = useParams();

  // Support either /books/:id/reviews or /reviews/:bookId
  const bookId =
    params.bookId ||
    params.id;


  // ====================================================
  // STATE
  // ====================================================

  const [book, setBook] =
    useState(null);

  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  // Review form
  const [rating, setRating] =
    useState(5);

  const [reviewText, setReviewText] =
    useState("");

  const [submittingReview, setSubmittingReview] =
    useState(false);


  // Comment forms
  const [commentTexts, setCommentTexts] =
    useState({});

  const [submittingComment, setSubmittingComment] =
    useState(null);


  // ====================================================
  // LOAD BOOK + REVIEWS
  // ====================================================

  useEffect(() => {

    if (!bookId) {
      setError("Book ID is missing.");
      setLoading(false);
      return;
    }


    const loadData = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          bookResult,
          reviewResult,
        ] = await Promise.all([
          getBookDetails(bookId),
          getReviewsForBook(bookId),
        ]);


        setBook(
          bookResult?.book || null
        );


        setReviews(
          reviewResult?.data || []
        );

      } catch (err) {

        console.error(
          "Unable to load reviews:",
          err
        );

        setError(
          err.message ||
            "Unable to load reviews."
        );

      } finally {

        setLoading(false);

      }
    };


    loadData();

  }, [bookId]);


  // ====================================================
  // CLEAR MESSAGE
  // ====================================================

  const showSuccess = (message) => {

    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

  };


  // ====================================================
  // SUBMIT REVIEW
  // ====================================================

  const handleSubmitReview = async (event) => {

    event.preventDefault();

    if (!reviewText.trim()) {

      setError(
        "Please write something before submitting your review."
      );

      return;
    }


    if (!book) {

      setError(
        "Book information is not available."
      );

      return;
    }


    try {

      setSubmittingReview(true);
      setError("");


      const result =
        await createReview({

          googleBookId:
            book.googleBookId || null,

          openLibraryId:
            book.openLibraryId || null,

          bookTitle:
            book.title,

          reviewerId:
            CURRENT_USER_ID,

          reviewerName:
            CURRENT_USER_NAME,

          rating,

          reviewText:
            reviewText.trim(),

        });


      if (result?.data) {

        setReviews((previous) => [
          result.data,
          ...previous,
        ]);

      }


      setReviewText("");
      setRating(5);

      showSuccess(
        "Review added successfully."
      );

    } catch (err) {

      console.error(
        "Create review error:",
        err
      );

      setError(
        err.message ||
          "Unable to add review."
      );

    } finally {

      setSubmittingReview(false);

    }
  };


  // ====================================================
  // LIKE / UNLIKE REVIEW
  // ====================================================

  const handleLike = async (reviewId) => {

    try {

      setError("");

      const result =
        await toggleLikeReview(
          reviewId,
          CURRENT_USER_ID
        );


      if (result?.data) {

        setReviews((previous) =>
          previous.map((review) =>
            review._id === reviewId
              ? result.data
              : review
          )
        );

      }

    } catch (err) {

      console.error(
        "Like review error:",
        err
      );

      setError(
        err.message ||
          "Unable to update like."
      );

    }
  };


  // ====================================================
  // COMMENT INPUT
  // ====================================================

  const handleCommentChange = (
    reviewId,
    value
  ) => {

    setCommentTexts((previous) => ({
      ...previous,
      [reviewId]: value,
    }));

  };


  // ====================================================
  // ADD COMMENT
  // ====================================================

  const handleAddComment = async (
    reviewId
  ) => {

    const text =
      commentTexts[reviewId]?.trim();


    if (!text) {

      setError(
        "Please write a comment first."
      );

      return;
    }


    try {

      setSubmittingComment(reviewId);
      setError("");


      const result =
        await addComment(
          reviewId,
          {
            commenterId:
              CURRENT_USER_ID,

            commenterName:
              CURRENT_USER_NAME,

            text,
          }
        );


      if (result?.data) {

        setReviews((previous) =>
          previous.map((review) =>
            review._id === reviewId
              ? result.data
              : review
          )
        );

      }


      setCommentTexts((previous) => ({
        ...previous,
        [reviewId]: "",
      }));


      showSuccess(
        "Comment added successfully."
      );

    } catch (err) {

      console.error(
        "Add comment error:",
        err
      );

      setError(
        err.message ||
          "Unable to add comment."
      );

    } finally {

      setSubmittingComment(null);

    }
  };


  // ====================================================
  // DELETE OWN COMMENT
  // ====================================================

  const handleDeleteComment = async (
    reviewId,
    commentId
  ) => {

    try {

      setError("");


      const result =
        await deleteOwnComment(
          reviewId,
          commentId,
          CURRENT_USER_ID
        );


      if (result?.data) {

        setReviews((previous) =>
          previous.map((review) =>
            review._id === reviewId
              ? result.data
              : review
          )
        );

      }


      showSuccess(
        "Comment deleted successfully."
      );

    } catch (err) {

      console.error(
        "Delete comment error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete comment."
      );

    }
  };


  // ====================================================
  // MODERATOR DELETE COMMENT
  // ====================================================

  const handleModeratorDelete = async (
    reviewId,
    commentId
  ) => {

    if (!CURRENT_USER_IS_MODERATOR) {

      setError(
        "You do not have moderator permission."
      );

      return;
    }


    try {

      setError("");


      const result =
        await moderatorDeleteComment(
          reviewId,
          commentId,
          CURRENT_USER_ID
        );


      if (result?.data) {

        setReviews((previous) =>
          previous.map((review) =>
            review._id === reviewId
              ? result.data
              : review
          )
        );

      }


      showSuccess(
        "Comment removed by moderator."
      );

    } catch (err) {

      console.error(
        "Moderator delete error:",
        err
      );

      setError(
        err.message ||
          "Unable to remove comment."
      );

    }
  };


  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate = (date) => {

    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );

  };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (
      <main className="mx-auto max-w-6xl px-6 py-12">

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <p className="text-lg font-semibold text-stone-600">
            Loading reviews...
          </p>

        </div>

      </main>
    );

  }


  // ====================================================
  // MAIN PAGE
  // ====================================================

  return (

    <main className="mx-auto max-w-6xl px-6 py-10">

      {/* =================================================
          BACK LINK
      ================================================== */}

      <Link
        to={`/books/${bookId}`}
        className="font-semibold text-[#6f3f26] hover:underline"
      >
        ← Back to Book
      </Link>


      {/* =================================================
          BOOK HEADER
      ================================================== */}

      {book && (

        <section className="mt-6 rounded-3xl bg-[#352522] p-7 text-white shadow-sm">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#dca77d]">
            Community
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {book.title}
          </h1>

          <p className="mt-2 text-stone-300">
            {book.authors?.length
              ? book.authors.join(", ")
              : "Unknown Author"}
          </p>

        </section>

      )}


      {/* =================================================
          ERROR MESSAGE
      ================================================== */}

      {error && (

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() => setError("")}
            className="font-bold"
          >
            ×
          </button>

        </div>

      )}


      {/* =================================================
          SUCCESS MESSAGE
      ================================================== */}

      {successMessage && (

        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 font-medium text-green-800">

          ✓ {successMessage}

        </div>

      )}


      {/* =================================================
          REVIEW SECTION
      ================================================== */}

      <section className="mt-7 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
            Community
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#352522]">
            Reviews & Comments
          </h2>

          <p className="mt-2 text-stone-600">
            Share your opinion and see what other readers think.
          </p>

        </div>


        {/* =================================================
            WRITE REVIEW
        ================================================== */}

        <div className="mt-7 rounded-2xl bg-[#faf6ef] p-6">

          <h3 className="text-xl font-bold text-[#352522]">
            Write a Review
          </h3>


          {/* Rating */}

          <div className="mt-5">

            <p className="mb-2 font-semibold text-stone-700">
              Rating
            </p>

            <div className="flex gap-1">

              {[1, 2, 3, 4, 5].map((value) => (

                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setRating(value)
                  }
                  aria-label={`Give ${value} star rating`}
                  className={`text-3xl transition ${
                    value <= rating
                      ? "text-amber-500"
                      : "text-stone-300"
                  } hover:scale-110`}
                >
                  ★
                </button>

              ))}

            </div>

            <p className="mt-1 text-sm text-stone-500">
              {rating} out of 5 stars
            </p>

          </div>


          {/* Review text */}

          <textarea
            value={reviewText}
            onChange={(event) =>
              setReviewText(
                event.target.value
              )
            }
            placeholder="Write your review..."
            rows={6}
            className="mt-5 w-full resize-y rounded-2xl border border-stone-300 bg-white px-5 py-4 text-stone-800 outline-none transition focus:border-[#6f3f26] focus:ring-2 focus:ring-[#6f3f26]/10"
          />


          {/* Submit */}

          <button
            type="button"
            onClick={handleSubmitReview}
            disabled={submittingReview}
            className="mt-4 rounded-xl bg-[#6f3f26] px-6 py-3 font-semibold text-white transition hover:bg-[#59301e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submittingReview
              ? "Submitting..."
              : "Submit Review"}
          </button>

        </div>


        {/* =================================================
            READER REVIEWS
        ================================================== */}

        <section className="mt-10">

          <div className="flex items-center justify-between">

            <h3 className="text-2xl font-bold text-[#352522]">
              Reader Reviews
            </h3>

            <span className="rounded-full bg-[#f5ebe1] px-4 py-2 text-sm font-semibold text-[#6f3f26]">
              {reviews.length}{" "}
              {reviews.length === 1
                ? "Review"
                : "Reviews"}
            </span>

          </div>


          {/* No reviews */}

          {reviews.length === 0 && (

            <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">

              <p className="text-lg font-semibold text-stone-600">
                No reviews yet.
              </p>

              <p className="mt-1 text-stone-500">
                Be the first reader to review this book.
              </p>

            </div>

          )}


          {/* Review list */}

          <div className="mt-5 space-y-6">

            {reviews.map((review) => {

              const likes =
                review.likedBy || [];

              const comments =
                review.comments || [];

              const isLiked =
                likes.includes(
                  CURRENT_USER_ID
                );


              return (

                <article
                  key={review._id}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                >

                  {/* Reviewer header */}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>

                      <h4 className="text-lg font-bold text-[#352522]">
                        {review.reviewerName ||
                          "BookVerse Reader"}
                      </h4>

                      <p className="mt-1 text-sm text-stone-500">
                        {formatDate(
                          review.createdAt
                        )}
                      </p>

                    </div>


                    {/* Rating */}

                    <div className="flex">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (

                          <span
                            key={star}
                            className={
                              star <= review.rating
                                ? "text-amber-500"
                                : "text-stone-300"
                            }
                          >
                            ★
                          </span>

                        )
                      )}

                    </div>

                  </div>


                  {/* Review text */}

                  <p className="mt-5 whitespace-pre-wrap leading-7 text-stone-700">
                    {review.reviewText}
                  </p>


                  {/* Like */}

                  <div className="mt-5">

                    <button
                      type="button"
                      onClick={() =>
                        handleLike(
                          review._id
                        )
                      }
                      className={`rounded-xl border px-4 py-2 font-semibold transition ${
                        isLiked
                          ? "border-[#6f3f26] bg-[#f5ebe1] text-[#6f3f26]"
                          : "border-stone-300 text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {isLiked
                        ? "♥ Liked"
                        : "♡ Like"}{" "}
                      ({likes.length})
                    </button>

                  </div>


                  {/* Divider */}

                  <div className="my-6 border-t border-stone-200" />


                  {/* Comments */}

                  <div>

                    <div className="flex items-center justify-between">

                      <h4 className="text-lg font-bold text-[#352522]">
                        Comments
                      </h4>

                      <span className="text-sm text-stone-500">
                        {comments.length}
                      </span>

                    </div>


                    {/* Existing comments */}

                    {comments.length > 0 && (

                      <div className="mt-4 space-y-3">

                        {comments.map(
                          (comment) => {

                            const isOwner =
                              comment.commenterId ===
                              CURRENT_USER_ID;


                            return (

                              <div
                                key={comment._id}
                                className="rounded-2xl bg-[#faf6ef] p-4"
                              >

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                                  <div>

                                    <p className="font-semibold text-[#352522]">
                                      {comment.commenterName ||
                                        "BookVerse Reader"}
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-stone-700">
                                      {comment.text}
                                    </p>

                                  </div>


                                  <p className="text-sm text-stone-500">
                                    {formatDate(
                                      comment.createdAt
                                    )}
                                  </p>

                                </div>


                                {/* Comment actions */}

                                <div className="mt-3 flex flex-wrap gap-3">

                                  {isOwner && (

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteComment(
                                          review._id,
                                          comment._id
                                        )
                                      }
                                      className="font-semibold text-red-600 hover:text-red-800 hover:underline"
                                    >
                                      Delete
                                    </button>

                                  )}


                                  {CURRENT_USER_IS_MODERATOR && (

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleModeratorDelete(
                                          review._id,
                                          comment._id
                                        )
                                      }
                                      className="font-semibold text-orange-600 hover:text-orange-800 hover:underline"
                                    >
                                      Moderator Remove
                                    </button>

                                  )}

                                </div>

                              </div>

                            );

                          }
                        )}

                      </div>

                    )}


                    {/* No comments */}

                    {comments.length === 0 && (

                      <p className="mt-3 text-sm text-stone-500">
                        No comments yet. Start the conversation.
                      </p>

                    )}


                    {/* Add comment */}

                    <div className="mt-5">

                      <textarea
                        value={
                          commentTexts[
                            review._id
                          ] || ""
                        }
                        onChange={(event) =>
                          handleCommentChange(
                            review._id,
                            event.target.value
                          )
                        }
                        placeholder="Write a comment..."
                        rows={3}
                        className="w-full resize-y rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-[#6f3f26] focus:ring-2 focus:ring-[#6f3f26]/10"
                      />


                      <button
                        type="button"
                        onClick={() =>
                          handleAddComment(
                            review._id
                          )
                        }
                        disabled={
                          submittingComment ===
                          review._id
                        }
                        className="mt-3 rounded-xl bg-[#6f3f26] px-5 py-2.5 font-semibold text-white transition hover:bg-[#59301e] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submittingComment ===
                        review._id
                          ? "Adding..."
                          : "Add Comment"}
                      </button>

                    </div>

                  </div>

                </article>

              );

            })}

          </div>

        </section>

      </section>

    </main>

  );

}