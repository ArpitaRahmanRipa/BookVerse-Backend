import { useNavigate } from "react-router";

export default function BookCard({ book }) {
  const navigate = useNavigate();

  const id =
    book.googleBookId ||
    book.openLibraryId;

  const authors =
    book.authors?.length > 0
      ? book.authors.join(", ")
      : "Unknown Author";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <div className="flex h-72 items-center justify-center bg-[#eee5d8] p-4">

        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full max-w-full object-contain shadow-md"
          />
        ) : (
          <div className="flex h-full w-40 items-center justify-center rounded-xl bg-[#352522] px-5 text-center font-semibold text-white">
            {book.title}
          </div>
        )}

      </div>

      <div className="flex flex-1 flex-col p-5">

        <h2 className="line-clamp-2 text-lg font-bold text-[#352522]">
          {book.title}
        </h2>

        <p className="mt-2 text-sm text-stone-600">
          {authors}
        </p>

        <p className="mt-3 text-sm font-semibold text-[#8a5d42]">
          ⭐{" "}
          {book.averageRating
            ? Number(
                book.averageRating
              ).toFixed(1)
            : "N/A"}
        </p>

        <button
          type="button"
          disabled={!id}
          onClick={() =>
            navigate(`/books/${id}`)
          }
          className="mt-auto rounded-xl bg-[#6f3f26] px-4 py-3 font-semibold text-white hover:bg-[#57301d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          View Details
        </button>

      </div>

    </article>
  );
}