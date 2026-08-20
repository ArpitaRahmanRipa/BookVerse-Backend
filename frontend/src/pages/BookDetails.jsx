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

// Temporary shared development user.
// Later replace with authenticated user.
const USER_ID = "21201436";

export default function BookDetails() {
  const { id } = useParams();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    shelfMessage,
    setShelfMessage,
  ] = useState("");

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

  const handleAddToShelf =
    async (shelf) => {
      if (!data?.book) {
        return;
      }

      try {
        const book = data.book;

        const result =
          await addBookToShelf({
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

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          Loading book details...
        </div>

      </main>
    );
  }

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

      <Link
        to="/books"
        className="font-semibold text-[#6f3f26] hover:underline"
      >
        ← Back to Book Search
      </Link>

      <section className="mt-6 grid gap-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-[260px_1fr] md:p-8">

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

          <p className="mt-7 leading-7 text-stone-700">
            {book.description ||
              "No description available."}
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl bg-[#faf6ef] p-4">
              <p className="text-sm text-stone-500">
                ISBN
              </p>
              <p className="mt-1 font-semibold">
                {book.isbn ||
                  "Unknown"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf6ef] p-4">
              <p className="text-sm text-stone-500">
                Pages
              </p>
              <p className="mt-1 font-semibold">
                {book.pageCount ||
                  "Unknown"}
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
                {Array.isArray(
                  book.language
                )
                  ? book.language.join(
                      ", "
                    )
                  : book.language ||
                    "Unknown"}
              </p>
            </div>

          </div>

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
                    ?.currentlyReading ||
                    0}
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

          <section className="mt-7">

            <h2 className="text-xl font-bold text-[#352522]">
              Add to Shelf
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">

              {(data.shelfOptions ||
                []).map((shelf) => (
                <button
                  key={shelf}
                  type="button"
                  onClick={() =>
                    handleAddToShelf(
                      shelf
                    )
                  }
                  className="rounded-xl border-2 border-[#6f3f26] px-4 py-2 font-semibold text-[#6f3f26] hover:bg-[#f5ebe1]"
                >
                  {shelf}
                </button>
              ))}

            </div>

            {shelfMessage && (
              <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 font-medium text-green-800">
                {shelfMessage}
              </div>
            )}

          </section>

        </div>

      </section>

    </main>
  );
}