import {
  useEffect,
  useState,
} from "react";

import {
  getYearlyReadingWrapped,
} from "../services/readingWrappedApi";

import {
  useAuth,
} from "../context/AuthContext";


export default function ReadingWrapped() {
  const {
    user,
  } = useAuth();

  const userId =
    user?.userId;


  const [wrapped, setWrapped] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    shareMessage,
    setShareMessage,
  ] = useState("");


  const year =
    new Date().getFullYear();


  // ==============================
  // Load Logged-In User's Wrapped
  // ==============================

  useEffect(() => {
    const loadWrapped =
      async () => {
        if (!userId) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError("");


          const result =
            await getYearlyReadingWrapped(
              userId,
              year
            );


          setWrapped(
            result.data
          );

        } catch (error) {

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load Reading Wrapped."
          );

        } finally {

          setLoading(false);

        }
      };


    loadWrapped();

  }, [
    userId,
    year,
  ]);


  // ==============================
  // Share Wrapped
  // ==============================

  const handleShare =
    async () => {
      if (!wrapped) {
        return;
      }


      const topBook =
        wrapped
          .highestRatedBooks?.[0];


      const shareText = `
📚 My ${wrapped.year} Reading Wrapped

Books Read: ${wrapped.totalBooksRead || 0}

Pages Read: ${wrapped.totalPagesRead || 0}

Favourite Author:
${wrapped.favoriteAuthors?.[0]?.author || "N/A"}

Top Rated Book:
${topBook?.title || "N/A"}

Rating:
⭐ ${topBook?.rating ?? "N/A"}

Achievement:
${wrapped.achievements?.[0]?.title || "N/A"}

Created with BookVerse
      `.trim();


      try {
        if (navigator.share) {

          await navigator.share({
            title:
              `${wrapped.year} Reading Wrapped`,

            text:
              shareText,
          });


          setShareMessage(
            "Shared successfully!"
          );

        } else {

          await navigator.clipboard.writeText(
            shareText
          );


          setShareMessage(
            "Copied to clipboard!"
          );

        }

      } catch {

        setShareMessage(
          "Sharing cancelled."
        );

      }
    };


  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">

        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

          <p className="text-lg text-stone-600">
            Loading your Reading Wrapped...
          </p>

        </div>

      </main>
    );
  }


  // ==============================
  // Error
  // ==============================

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">

        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center text-red-700">

          {error}

        </div>

      </main>
    );
  }


  if (!wrapped) {
    return null;
  }


  const highestRatedBooks =
    wrapped.highestRatedBooks || [];

  const favoriteAuthors =
    wrapped.favoriteAuthors || [];

  const achievements =
    wrapped.achievements || [];


  return (
    <main className="mx-auto max-w-6xl px-6 py-10">


      {/* ============================== */}
      {/* Header */}
      {/* ============================== */}

      <section className="mb-8 text-center">

        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
          BookVerse
        </p>


        <h1 className="mt-2 text-4xl font-bold text-[#352522]">
          📚 {wrapped.year} Reading Wrapped
        </h1>


        <p className="mx-auto mt-3 max-w-2xl text-stone-600">
          A look back at your books,
          pages, favourite authors,
          ratings, and reading
          achievements.
        </p>


        {user?.name && (
          <p className="mt-3 font-semibold text-[#6f3f26]">
            Wrapped for{" "}
            {user.name}
          </p>
        )}


        <button
          type="button"
          onClick={handleShare}
          className="mt-6 rounded-xl bg-[#6f3f26] px-6 py-3 font-semibold text-white transition hover:bg-[#57301d]"
        >
          📤 Share My Reading Wrapped
        </button>


        {shareMessage && (
          <p className="mt-3 text-sm font-semibold text-green-700">
            {shareMessage}
          </p>
        )}

      </section>



      {/* ============================== */}
      {/* Summary */}
      {/* ============================== */}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">


        <SummaryCard
          label="Books Read"
          value={
            wrapped.totalBooksRead || 0
          }
          icon="📚"
        />


        <SummaryCard
          label="Pages Read"
          value={
            wrapped.totalPagesRead || 0
          }
          icon="📖"
        />


        <SummaryCard
          label="Most Active Month"
          value={
            wrapped
              .mostActiveMonth
              ?.month || "N/A"
          }
          icon="📅"
        />


        <SummaryCard
          label="Achievements"
          value={
            achievements.length
          }
          icon="🏆"
        />

      </section>



      <div className="mt-6 grid gap-6 lg:grid-cols-2">


        {/* ============================== */}
        {/* Highest Rated */}
        {/* ============================== */}

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">


          <h2 className="text-2xl font-bold text-[#352522]">
            ⭐ Highest Rated Books
          </h2>


          {highestRatedBooks.length ===
          0 ? (

            <EmptyState
              text="No rated finished books yet."
            />

          ) : (

            <div className="mt-5 space-y-3">

              {highestRatedBooks.map(
                (
                  book,
                  index
                ) => (

                  <article
                    key={
                      book.bookId ||
                      `${book.title}-${index}`
                    }
                    className="rounded-2xl border border-stone-200 bg-[#faf6ef] p-4"
                  >

                    <h3 className="font-bold text-[#352522]">
                      {book.title}
                    </h3>


                    <p className="mt-1 text-sm text-stone-600">
                      {book.author ||
                        "Unknown Author"}
                    </p>


                    <p className="mt-2 font-semibold text-[#6f3f26]">
                      ⭐{" "}
                      {book.rating}
                    </p>

                  </article>

                )
              )}

            </div>

          )}

        </section>



        {/* ============================== */}
        {/* Favorite Authors */}
        {/* ============================== */}

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">


          <h2 className="text-2xl font-bold text-[#352522]">
            ✍️ Favourite Authors
          </h2>


          {favoriteAuthors.length ===
          0 ? (

            <EmptyState
              text="No favourite author data yet."
            />

          ) : (

            <div className="mt-5 space-y-3">

              {favoriteAuthors.map(
                (
                  author,
                  index
                ) => (

                  <div
                    key={`${author.author}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-stone-200 bg-[#faf6ef] p-4"
                  >

                    <span className="font-semibold text-[#352522]">
                      {
                        author.author
                      }
                    </span>


                    <span className="text-sm text-stone-500">
                      {
                        author.booksRead
                      }{" "}
                      {
                        author.booksRead === 1
                          ? "book"
                          : "books"
                      }
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>



      {/* ============================== */}
      {/* Active Month */}
      {/* ============================== */}

      <section className="mt-6 rounded-3xl bg-[#352522] p-7 text-white shadow-sm">


        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d6ad8c]">
          Reading Activity
        </p>


        <h2 className="mt-2 text-3xl font-bold">
          📅 Most Active Month
        </h2>


        {wrapped.mostActiveMonth ? (

          <div className="mt-5">

            <p className="text-2xl font-bold">
              {
                wrapped
                  .mostActiveMonth
                  .month
              }
            </p>


            <p className="mt-2 text-stone-300">
              You finished{" "}
              {
                wrapped
                  .mostActiveMonth
                  .booksRead
              }{" "}
              {
                wrapped
                  .mostActiveMonth
                  .booksRead === 1
                  ? "book"
                  : "books"
              }{" "}
              during this month.
            </p>

          </div>

        ) : (

          <p className="mt-4 text-stone-300">
            Finish books this year to
            build your reading activity
            summary.
          </p>

        )}

      </section>



      {/* ============================== */}
      {/* Achievements */}
      {/* ============================== */}

      <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">


        <h2 className="text-2xl font-bold text-[#352522]">
          🏆 Achievements
        </h2>


        {achievements.length === 0 ? (

          <EmptyState
            text="No achievements unlocked yet. Keep reading!"
          />

        ) : (

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            {achievements.map(
              (
                achievement,
                index
              ) => (

                <article
                  key={`${achievement.title}-${index}`}
                  className="rounded-2xl border border-[#eadfce] bg-[#faf6ef] p-5"
                >

                  <div className="text-3xl">
                    🏅
                  </div>


                  <h3 className="mt-3 text-lg font-bold text-[#352522]">
                    {
                      achievement.title
                    }
                  </h3>


                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {
                      achievement.description
                    }
                  </p>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}


// ==============================
// Summary Card
// ==============================

function SummaryCard({
  label,
  value,
  icon,
}) {
  return (
    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">

      <div className="text-3xl">
        {icon}
      </div>

      <p className="mt-4 text-sm font-semibold text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-[#352522]">
        {value}
      </p>

    </article>
  );
}


// ==============================
// Empty State
// ==============================

function EmptyState({
  text,
}) {
  return (
    <div className="mt-5 rounded-2xl bg-[#faf6ef] p-6 text-center text-stone-500">
      {text}
    </div>
  );
}