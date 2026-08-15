import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import {
  deleteDiaryEntry,
  getUserProgress,
} from "../services/readingProgressApi";

const USER_ID = "21201436";

function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ReadingDiaryPage() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const diaryEntries = useMemo(() => {
    const allEntries = records.flatMap((record) =>
      (record.diaryEntries || []).map((entry) => ({
        ...entry,
        progressId: record._id,
        bookTitle: record.bookTitle,
        author: record.author,
        status: record.status,
      }))
    );

    const filteredEntries =
      filter === "All"
        ? allEntries
        : allEntries.filter(
            (entry) => entry.visibility === filter
          );

    return filteredEntries.sort(
      (a, b) =>
        new Date(a.entryDate).getTime() -
        new Date(b.entryDate).getTime()
    );
  }, [records, filter]);

  const loadDiary = async () => {
    try {
      setLoading(true);
      setMessage("");

      const result = await getUserProgress(USER_ID);

      setRecords(result.data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiary();
  }, []);

  const handleDelete = async (
    progressId,
    entryId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this diary entry?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const result = await deleteDiaryEntry(
        progressId,
        entryId
      );

      setRecords((currentRecords) =>
        currentRecords.map((record) =>
          record._id === progressId
            ? result.data
            : record
        )
      );
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">

      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5d42]">
            Reading History
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#352522]">
            My Reading Diary
          </h1>

          <p className="mt-2 text-stone-600">
            Browse your reading notes and memories
            in chronological order.
          </p>

        </div>

        <Link
          to="/"
          className="inline-flex self-start rounded-xl border-2 border-[#6f3f26] px-5 py-3 font-semibold text-[#6f3f26] hover:bg-[#f5ebe1]"
        >
          ← Back to Reading Progress
        </Link>

      </section>

      {/* FILTER BUTTONS */}

      <section className="mt-8 flex flex-wrap gap-3">

        {["All", "Public", "Private"].map(
          (option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
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

      {/* ERROR MESSAGE */}

      {message && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-800">
          {message}
        </div>
      )}

      {/* CONTENT */}

      {loading ? (

        <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
          Loading reading diary...
        </div>

      ) : diaryEntries.length === 0 ? (

        <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm">

          <div className="text-5xl">
            📝
          </div>

          <h2 className="mt-5 text-2xl font-bold text-[#352522]">
            No diary entries found
          </h2>

          <p className="mt-2 text-stone-600">
            Go back to Reading Progress and save
            your first diary note.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-[#6f3f26] px-6 py-3 font-semibold text-white hover:bg-[#57301d]"
          >
            Go to Reading Progress
          </Link>

        </section>

      ) : (

        <section className="mt-8 space-y-5">

          {diaryEntries.map((entry) => (

            <article
              key={entry._id}
              className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
            >

              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <h2 className="text-xl font-bold text-[#352522]">
                      {entry.bookTitle}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        entry.visibility === "Public"
                          ? "bg-green-100 text-green-800"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {entry.visibility}
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-stone-500">
                    by{" "}
                    {entry.author ||
                      "Unknown Author"}
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
                  className="self-start rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>

              </div>

              <div className="mt-5 rounded-2xl bg-[#faf6ef] p-5">

                <p className="leading-7 text-stone-700">
                  {entry.note}
                </p>

              </div>

              <footer className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-500">

                <span>
                  Page {entry.pageNumber ?? 0}
                </span>

                <span>
                  {entry.status}
                </span>

                <time>
                  {formatDate(entry.entryDate)}
                </time>

              </footer>

            </article>

          ))}

        </section>

      )}

    </main>
  );
}