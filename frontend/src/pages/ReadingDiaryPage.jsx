import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router";

import {
  deleteDiaryEntry,
  getUserProgress,
} from "../services/readingProgressApi";

import {
  useAuth,
} from "../context/AuthContext";


function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}


export default function ReadingDiaryPage() {
  const {
    user,
  } = useAuth();

  const userId =
    user?.userId;


  const [
    records,
    setRecords,
  ] = useState([]);


  const [
    filter,
    setFilter,
  ] = useState("All");


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    message,
    setMessage,
  ] = useState({
    type: "",
    text: "",
  });


  // ==============================
  // Collect Diary Entries
  // ==============================

  const diaryEntries =
    useMemo(() => {
      const allEntries =
        records.flatMap(
          (record) =>
            (
              record.diaryEntries ||
              []
            ).map(
              (entry) => ({
                ...entry,

                progressId:
                  record._id,

                bookTitle:
                  record.bookTitle,

                author:
                  record.author,

                status:
                  record.status,
              })
            )
        );


      const filteredEntries =
        filter === "All"
          ? allEntries
          : allEntries.filter(
              (entry) =>
                entry.visibility ===
                filter
            );


      return filteredEntries.sort(
        (a, b) =>
          new Date(
            a.entryDate
          ).getTime() -
          new Date(
            b.entryDate
          ).getTime()
      );

    }, [
      records,
      filter,
    ]);


  // ==============================
  // Load Logged-In User Diary
  // ==============================

  useEffect(() => {
    const loadDiary =
      async () => {
        if (!userId) {
          setLoading(false);
          return;
        }


        try {
          setLoading(true);

          setMessage({
            type: "",
            text: "",
          });


          const result =
            await getUserProgress(
              userId
            );


          setRecords(
            result.data || []
          );

        } catch (error) {

          setMessage({
            type: "error",

            text:
              error instanceof Error
                ? error.message
                : "Failed to load reading diary.",
          });

        } finally {

          setLoading(false);

        }
      };


    loadDiary();

  }, [userId]);


  // ==============================
  // Delete Diary Entry
  // ==============================

  const handleDelete =
    async (
      progressId,
      entryId
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this diary entry?"
        );


      if (!confirmed) {
        return;
      }


      try {
        const result =
          await deleteDiaryEntry(
            progressId,
            entryId
          );


        setRecords(
          (currentRecords) =>
            currentRecords.map(
              (record) =>
                record._id ===
                progressId
                  ? result.data
                  : record
            )
        );


        setMessage({
          type: "success",
          text:
            "Diary entry deleted successfully.",
        });

      } catch (error) {

        setMessage({
          type: "error",

          text:
            error instanceof Error
              ? error.message
              : "Failed to delete diary entry.",
        });

      }
    };


  return (
    <main className="mx-auto max-w-5xl px-6 py-10">


      {/* ============================== */}
      {/* Header */}
      {/* ============================== */}

      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">


        <div>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
            Reading History
          </p>


          <h1 className="mt-2 text-4xl font-bold text-[#352522]">
            My Reading Diary
          </h1>


          <p className="mt-2 text-stone-600">
            Browse your reading notes and
            memories in chronological
            order.
          </p>


          {user?.name && (
            <p className="mt-2 text-sm font-semibold text-[#6f3f26]">
              Diary for{" "}
              {user.name}
            </p>
          )}

        </div>


        <Link
          to="/reading-progress"
          className="inline-flex self-start rounded-xl border-2 border-[#6f3f26] px-5 py-3 font-semibold text-[#6f3f26] transition hover:bg-[#f5ebe1]"
        >
          ← Back to Reading Progress
        </Link>

      </section>



      {/* ============================== */}
      {/* Filters */}
      {/* ============================== */}

      <section className="mt-8 flex flex-wrap gap-3">

        {[
          "All",
          "Public",
          "Private",
        ].map(
          (option) => (

            <button
              key={option}
              type="button"
              onClick={() =>
                setFilter(option)
              }
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                filter === option
                  ? "bg-[#6f3f26] text-white"
                  : "border border-stone-300 bg-white text-stone-700 hover:border-[#8a5d42]"
              }`}
            >
              {option}
            </button>

          )
        )}

      </section>



      {/* ============================== */}
      {/* Message */}
      {/* ============================== */}

      {message.text && (
        <div
          className={`mt-6 rounded-xl border px-5 py-4 font-medium ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}



      {/* ============================== */}
      {/* Content */}
      {/* ============================== */}

      {loading ? (

        <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">

          <p className="text-stone-600">
            Loading reading diary...
          </p>

        </div>

      ) : diaryEntries.length === 0 ? (

        <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">


          <div className="text-5xl">
            📝
          </div>


          <h2 className="mt-5 text-2xl font-bold text-[#352522]">
            No diary entries found
          </h2>


          <p className="mx-auto mt-2 max-w-xl text-stone-600">

            {filter === "All"
              ? "Go back to Reading Progress and save your first diary note."
              : `You currently have no ${filter.toLowerCase()} diary entries.`}

          </p>


          <Link
            to="/reading-progress"
            className="mt-6 inline-block rounded-xl bg-[#6f3f26] px-6 py-3 font-semibold text-white transition hover:bg-[#57301d]"
          >
            Go to Reading Progress
          </Link>

        </section>

      ) : (

        <section className="mt-8 space-y-5">


          {diaryEntries.map(
            (entry) => (

              <article
                key={
                  entry._id
                }
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
              >


                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">


                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-xl font-bold text-[#352522]">
                        {
                          entry.bookTitle
                        }
                      </h2>


                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          entry.visibility ===
                          "Public"
                            ? "bg-green-100 text-green-800"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {
                          entry.visibility
                        }
                      </span>

                    </div>


                    <p className="mt-1 text-sm text-stone-500">
                      by{" "}
                      {
                        entry.author ||
                        "Unknown Author"
                      }
                    </p>

                  </div>



                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        entry.progressId,
                        entry._id
                      )
                    }
                    className="self-start rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    Delete
                  </button>

                </div>



                {/* Diary Note */}

                <div className="mt-5 rounded-2xl bg-[#faf6ef] p-5">

                  <p className="leading-7 text-stone-700">
                    {entry.note}
                  </p>

                </div>



                {/* Entry Details */}

                <footer className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-500">


                  <span>
                    Page{" "}
                    {
                      entry.pageNumber ??
                      0
                    }
                  </span>


                  <span>
                    {
                      entry.status
                    }
                  </span>


                  <time>
                    {
                      formatDate(
                        entry.entryDate
                      )
                    }
                  </time>

                </footer>

              </article>

            )
          )}

        </section>

      )}

    </main>
  );
}