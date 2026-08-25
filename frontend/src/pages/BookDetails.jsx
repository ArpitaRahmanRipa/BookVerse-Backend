import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import {
  addBookToShelf,
  getBookDetails,
} from "../services/bookApi";

import {
  getReviewsForBook,
  createReview,
  deleteOwnReview,
  toggleLikeReview,
  addComment,
  deleteOwnComment,
  moderatorDeleteComment,
} from "../services/reviewApi";

// Temporary shared development user.
// Later replace with authenticated user.
const USER_ID = "reader002";

export default function BookDetails() {
  const { id } = useParams();

  // ========================================
  // BOOK STATE
  // ========================================

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [shelfMessage, setShelfMessage] =
    useState("");

  // ========================================
  // REVIEW STATE
  // ========================================

  const [reviews, setReviews] = useState([]);

  const [reviewLoading, setReviewLoading] =
    useState(true);

  const [reviewRating, setReviewRating] =
    useState(5);

  const [reviewText, setReviewText] =
    useState("");

  const [reviewMessage, setReviewMessage] =
    useState("");

  // Stores comment text separately for
  // each review.
  const [commentTexts, setCommentTexts] =
    useState({});

  // ========================================
  // LOAD BOOK DETAILS
  // ========================================

  useEffect(() => {
    let cancelled = false;

    getBookDetails(id)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage(
            error.message ||
              "Unable to load book."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ========================================
  // LOAD REVIEWS
  // ========================================

  useEffect(() => {
    let cancelled = false;

    setReviewLoading(true);

    getReviewsForBook(id)
      .then((result) => {
        if (!cancelled) {
          setReviews(result.data || []);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setReviewMessage(
            error.message ||
              "Unable to load reviews."
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setReviewLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ========================================
  // ADD BOOK TO SHELF
  // ========================================

  const handleAddToShelf = async (shelf) => {
    if (!data?.book) {
      return;
    }

    try {
      const book = data.book;

      const result = await addBookToShelf({
        userId: USER_ID,

        bookId:
          book.googleBookId ||
          book.openLibraryId ||
          id,

        bookTitle: book.title,

        authors:
          book.authors || [],

        coverImage:
          book.coverImage || "",

        shelf,
      });

      setShelfMessage(
        result.message ||
          "Shelf updated."
      );
    } catch (error) {
      setShelfMessage(
        error.message ||
          "Unable to update shelf."
      );
    }
  };

  // ========================================
  // CREATE REVIEW
  // ========================================

  const handleCreateReview = async () => {
    if (!data?.book) {
      return;
    }

    if (!reviewText.trim()) {
      setReviewMessage(
        "Please write your review."
      );
      return;
    }

    try {
      const book = data.book;

      const result = await createReview({
        googleBookId:
          book.googleBookId || null,

        openLibraryId:
          book.openLibraryId || null,

        bookTitle: book.title,

        reviewerId: USER_ID,

        reviewerName:
          "BookVerse Reader",

        rating: Number(reviewRating),

        reviewText:
          reviewText.trim(),
      });

      // Put the newly-created review
      // at the beginning.
      setReviews((current) => [
        result.data,
        ...current,
      ]);

      // Reset form.
      setReviewText("");
      setReviewRating(5);

      setReviewMessage(
        "Review added successfully."
      );
    } catch (error) {
      setReviewMessage(
        error.message ||
          "Unable to create review."
      );
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          Loading book details...
        </div>
      </main>
    );
  }

  // ========================================
  // BOOK NOT FOUND
  // ========================================

  if (!data?.book) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <h1 className="text-2xl font-bold text-[#352522]">
            Book not found
          </h1>

          <p className="mt-3 text-stone-600">
            {message}
          </p>

          <Link
            to="/books"
            className="mt-6 inline-block font-semibold text-[#6f3f26] hover:underline"
          >
            ← Back to Books
          </Link>

        </div>
      </main>
    );
  }

  const book = data.book;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">

      {/* ========================================
          BACK TO BOOKS
      ======================================== */}

      <Link
        to="/books"
        className="font-semibold text-[#6f3f26] hover:underline"
      >
        ← Back to Book Search
      </Link>

      {/* ========================================
          BOOK DETAILS
      ======================================== */}

      <section className="mt-6 grid gap-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-[260px_1fr] md:p-8">

        {/* BOOK COVER */}

        <div>
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="mx-auto w-full max-w-[260px] rounded-xl object-cover shadow-lg"
            />
          ) : (
            <div className="mx-auto flex h-96 max-w-[260px] items-center justify-center rounded-xl bg-[#352522] p-6 text-center text-xl font-bold text-white">
              {book.title}
            </div>
          )}
        </div>

        {/* BOOK INFORMATION */}

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
            Book Details
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#352522]">
            {book.title}
          </h1>

          <p className="mt-3 text-lg text-stone-600">
            {book.authors?.length
              ? book.authors.join(", ")
              : "Unknown Author"}
          </p>

          {/* RATINGS */}

          <div className="mt-5 flex flex-wrap gap-3">

            <span className="rounded-full bg-[#f5ebe1] px-4 py-2 text-sm font-semibold text-[#6f3f26]">
              ⭐{" "}
              {book.averageRating
                ? Number(
                    book.averageRating
                  ).toFixed(1)
                : "N/A"}
            </span>

            <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-600">
              {book.ratingsCount || 0} ratings
            </span>

          </div>

          {/* DESCRIPTION */}

          <p className="mt-7 leading-7 text-stone-700">
            {book.description ||
              "No description available."}
          </p>

          {/* BOOK METADATA */}

          <div className="mt-7 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl bg-[#faf6ef] p-4">
              <p className="text-sm text-stone-500">
                ISBN
              </p>

              <p className="mt-1 font-semibold">
                {book.isbn || "Unknown"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf6ef] p-4">
              <p className="text-sm text-stone-500">
                Pages
              </p>

              <p className="mt-1 font-semibold">
                {book.pageCount || "Unknown"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf6ef] p-4">
              <p className="text-sm text-stone-500">
                Publication
              </p>

              <p className="mt-1 font-semibold">
                {book.publicationDate ||
                  "Unknown"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf6ef] p-4">
              <p className="text-sm text-stone-500">
                Language
              </p>

              <p className="mt-1 font-semibold">
                {Array.isArray(book.language)
                  ? book.language.join(", ")
                  : book.language ||
                    "Unknown"}
              </p>
            </div>

          </div>

          {/* ========================================
              READER ACTIVITY
          ======================================== */}

          <section className="mt-7 rounded-2xl border border-stone-200 p-5">

            <h2 className="text-xl font-bold text-[#352522]">
              Reader Activity
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">

              <div className="rounded-xl bg-[#faf6ef] p-4">
                <p className="text-sm text-stone-500">
                  Reading
                </p>

                <p className="mt-1 text-xl font-bold">
                  {data.readerActivity
                    ?.currentlyReading || 0}
                </p>
              </div>

              <div className="rounded-xl bg-[#faf6ef] p-4">
                <p className="text-sm text-stone-500">
                  Finished
                </p>

                <p className="mt-1 text-xl font-bold">
                  {data.readerActivity
                    ?.completed || 0}
                </p>
              </div>

              <div className="rounded-xl bg-[#faf6ef] p-4">
                <p className="text-sm text-stone-500">
                  Total Readers
                </p>

                <p className="mt-1 text-xl font-bold">
                  {data.readerActivity
                    ?.totalReaders || 0}
                </p>
              </div>

            </div>

          </section>

          {/* ========================================
              ADD TO SHELF
          ======================================== */}

          <section className="mt-7">

            <h2 className="text-xl font-bold text-[#352522]">
              Add to Shelf
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">

              {(data.shelfOptions || []).map(
                (shelf) => (
                  <button
                    key={shelf}
                    type="button"
                    onClick={() =>
                      handleAddToShelf(shelf)
                    }
                    className="rounded-xl border-2 border-[#6f3f26] px-4 py-2 font-semibold text-[#6f3f26] hover:bg-[#f5ebe1]"
                  >
                    {shelf}
                  </button>
                )
              )}

            </div>

            {shelfMessage && (
              <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 font-medium text-green-800">
                {shelfMessage}
              </div>
            )}

          </section>

        </div>
      </section>

      {/* ==========================================
          REVIEWS & COMMENTS
      ========================================== */}

      <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">

        {/* HEADER */}

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
            Community
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#352522]">
            Reviews & Comments
          </h2>

          <p className="mt-2 text-stone-600">
            Share your opinion and see what
            other readers think.
          </p>

        </div>

        {/* ========================================
            WRITE REVIEW
        ======================================== */}

        <div className="mt-8 rounded-2xl bg-[#faf6ef] p-5">

          <h3 className="text-xl font-bold text-[#352522]">
            Write a Review
          </h3>

          {/* RATING */}

          <div className="mt-5">

            <p className="mb-2 text-sm font-semibold text-stone-600">
              Rating
            </p>

            <div className="flex gap-2">

              {[1, 2, 3, 4, 5].map(
                (rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      setReviewRating(rating)
                    }
                    className={`text-3xl transition ${
                      rating <= reviewRating
                        ? "text-yellow-500"
                        : "text-stone-300"
                    }`}
                    aria-label={`Rate ${rating} out of 5`}
                  >
                    ★
                  </button>
                )
              )}

            </div>

          </div>

          {/* REVIEW TEXT */}

          <textarea
            value={reviewText}
            onChange={(event) =>
              setReviewText(
                event.target.value
              )
            }
            placeholder="Write your review..."
            rows={5}
            className="mt-5 w-full rounded-xl border border-stone-300 bg-white p-4 outline-none focus:border-[#6f3f26]"
          />

          {/* SUBMIT */}

          <button
            type="button"
            onClick={handleCreateReview}
            className="mt-4 rounded-xl bg-[#6f3f26] px-6 py-3 font-semibold text-white hover:bg-[#58321f]"
          >
            Submit Review
          </button>

          {reviewMessage && (
            <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 font-medium text-green-800">
              {reviewMessage}
            </div>
          )}

        </div>

        {/* ========================================
            EXISTING REVIEWS
        ======================================== */}

        <div className="mt-8">

          <h3 className="text-xl font-bold text-[#352522]">
            Reader Reviews
          </h3>

          {reviewLoading ? (
            <div className="mt-5 rounded-2xl bg-stone-50 p-6 text-center text-stone-600">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-stone-50 p-6 text-center text-stone-600">
              No reviews yet. Be the first
              to review this book!
            </div>
          ) : (
            <div className="mt-5 space-y-6">

              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  userId={USER_ID}
                  commentTexts={commentTexts}
                  setCommentTexts={
                    setCommentTexts
                  }
                  setReviews={setReviews}
                />
              ))}

            </div>
          )}

        </div>

      </section>
    </main>
  );
}


// ======================================================
// REVIEW CARD
// ======================================================

function ReviewCard({
  review,
  userId,
  commentTexts,
  setCommentTexts,
  setReviews,
}) {

  const [actionMessage, setActionMessage] =
    useState("");

  const [commentLoading, setCommentLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  // ========================================
  // LIKE / UNLIKE
  // ========================================

  const handleLike = async () => {
    try {

      const result =
        await toggleLikeReview(
          review._id,
          userId
        );

      setReviews((current) =>
        current.map((item) =>
          item._id === review._id
            ? result.data
            : item
        )
      );

    } catch (error) {

      setActionMessage(
        error.message ||
          "Unable to like review."
      );

    }
  };

  // ========================================
  // DELETE OWN REVIEW
  // ========================================

  const handleDeleteReview = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    setDeleteLoading(true);

    try {

      await deleteOwnReview(
        review._id,
        userId
      );

      // Remove the deleted review
      // immediately from the page.
      setReviews((current) =>
        current.filter(
          (item) =>
            item._id !== review._id
        )
      );

      setActionMessage(
        "Review deleted successfully."
      );

    } catch (error) {

      setActionMessage(
        error.message ||
          "Unable to delete review."
      );

    } finally {

      setDeleteLoading(false);

    }
  };

  // ========================================
  // ADD COMMENT
  // ========================================

  const handleComment = async () => {

    const text =
      commentTexts[review._id] || "";

    if (!text.trim()) {

      setActionMessage(
        "Please write a comment."
      );

      return;
    }

    setCommentLoading(true);

    try {

      const result =
        await addComment(
          review._id,
          {
            commenterId: userId,

            commenterName:
              "BookVerse Reader",

            text: text.trim(),
          }
        );

      setReviews((current) =>
        current.map((item) =>
          item._id === review._id
            ? result.data
            : item
        )
      );

      setCommentTexts((current) => ({
        ...current,
        [review._id]: "",
      }));

      setActionMessage(
        "Comment added successfully."
      );

    } catch (error) {

      setActionMessage(
        error.message ||
          "Unable to add comment."
      );

    } finally {

      setCommentLoading(false);

    }
  };

  // ========================================
  // DELETE OWN COMMENT
  // ========================================

  const handleDeleteComment =
    async (commentId) => {

      try {

        const result =
          await deleteOwnComment(
            review._id,
            commentId,
            userId
          );

        setReviews((current) =>
          current.map((item) =>
            item._id === review._id
              ? result.data
              : item
          )
        );

        setActionMessage(
          "Comment deleted successfully."
        );

      } catch (error) {

        setActionMessage(
          error.message ||
            "Unable to delete comment."
        );

      }
    };

  // ========================================
  // MODERATOR DELETE
  // ========================================

  const handleModeratorDelete =
    async (commentId) => {

      try {

        const result =
          await moderatorDeleteComment(
            review._id,
            commentId,
            "moderator001"
          );

        setReviews((current) =>
          current.map((item) =>
            item._id === review._id
              ? result.data
              : item
          )
        );

        setActionMessage(
          "Comment removed by moderator."
        );

      } catch (error) {

        setActionMessage(
          error.message ||
            "Unable to remove comment."
        );

      }
    };

  // ========================================
  // CHECK LIKE STATUS
  // ========================================

  const liked =
    review.likedBy?.includes(userId);

  // ========================================
  // CHECK REVIEW OWNERSHIP
  // ========================================

  const isReviewOwner =
    review.reviewerId === userId;

  // ========================================
  // RENDER REVIEW
  // ========================================

  return (
    <article className="rounded-2xl border border-stone-200 p-5">

      {/* ========================================
          REVIEW HEADER
      ======================================== */}

      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>

          <h4 className="font-bold text-[#352522]">
            {review.reviewerName}
          </h4>

          <div className="mt-1 flex gap-1">

            {[1, 2, 3, 4, 5].map(
              (star) => (
                <span
                  key={star}
                  className={
                    star <= review.rating
                      ? "text-yellow-500"
                      : "text-stone-300"
                  }
                >
                  ★
                </span>
              )
            )}

          </div>

        </div>

        <span className="text-sm text-stone-500">
          {review.createdAt
            ? new Date(
                review.createdAt
              ).toLocaleDateString()
            : ""}
        </span>

      </div>

      {/* ========================================
          REVIEW TEXT
      ======================================== */}

      <p className="mt-4 leading-7 text-stone-700">
        {review.reviewText}
      </p>

      {/* ========================================
          REVIEW ACTIONS
      ======================================== */}

      <div className="mt-5 flex flex-wrap gap-3">

        {/* LIKE */}

        <button
          type="button"
          onClick={handleLike}
          className={`rounded-xl px-4 py-2 font-semibold ${
            liked
              ? "bg-[#6f3f26] text-white"
              : "border border-stone-300 text-stone-700 hover:bg-stone-50"
          }`}
        >
          {liked
            ? "♥ Liked"
            : "♡ Like"}{" "}
          ({review.likedBy?.length || 0})
        </button>

        {/* DELETE REVIEW */}

        {isReviewOwner && (
          <button
            type="button"
            onClick={handleDeleteReview}
            disabled={deleteLoading}
            className="rounded-xl border border-red-300 px-4 py-2 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteLoading
              ? "Deleting..."
              : "Delete Review"}
          </button>
        )}

      </div>

      {/* ========================================
          COMMENTS
      ======================================== */}

      <div className="mt-6 border-t border-stone-200 pt-5">

        <h5 className="font-bold text-[#352522]">
          Comments
        </h5>

        {/* ========================================
            EXISTING COMMENTS
        ======================================== */}

        {review.comments?.length ? (

          <div className="mt-4 space-y-3">

            {review.comments.map(
              (comment) => (

                <div
                  key={comment._id}
                  className="rounded-xl bg-stone-50 p-4"
                >

                  <div className="flex flex-wrap items-center justify-between gap-2">

                    <span className="font-semibold text-[#352522]">
                      {comment.commenterName}
                    </span>

                    <span className="text-xs text-stone-500">
                      {comment.createdAt
                        ? new Date(
                            comment.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </span>

                  </div>

                  <p className="mt-2 text-stone-700">
                    {comment.text}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {/* DELETE OWN COMMENT */}

                    {comment.commenterId ===
                      userId && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteComment(
                            comment._id
                          )
                        }
                        className="text-sm font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}

                    {/* MODERATOR DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleModeratorDelete(
                          comment._id
                        )
                      }
                      className="text-sm font-semibold text-orange-700 hover:underline"
                    >
                      Moderator Remove
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <p className="mt-3 text-sm text-stone-500">
            No comments yet.
          </p>

        )}

        {/* ========================================
            ADD COMMENT
        ======================================== */}

        <div className="mt-5">

          <textarea
            value={
              commentTexts[review._id] ||
              ""
            }
            onChange={(event) =>
              setCommentTexts(
                (current) => ({
                  ...current,
                  [review._id]:
                    event.target.value,
                })
              )
            }
            placeholder="Write a comment..."
            rows={3}
            className="w-full rounded-xl border border-stone-300 p-3 outline-none focus:border-[#6f3f26]"
          />

          <button
            type="button"
            disabled={commentLoading}
            onClick={handleComment}
            className="mt-3 rounded-xl bg-[#6f3f26] px-5 py-2 font-semibold text-white hover:bg-[#58321f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {commentLoading
              ? "Adding..."
              : "Add Comment"}
          </button>

        </div>

      </div>

      {/* ========================================
          ACTION MESSAGE
      ======================================== */}

      {actionMessage && (
        <div className="mt-4 rounded-xl bg-stone-100 px-4 py-3 text-sm font-medium text-stone-700">
          {actionMessage}
        </div>
      )}

    </article>
  );
}