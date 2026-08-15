import { useCallback, useEffect, useState } from "react";
import { fetchReadingStatistics } from "../api/statisticsApi.js";
import EmptyState from "../components/EmptyState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import MonthlyChart from "../components/MonthlyChart.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBreakdown from "../components/StatusBreakdown.jsx";
import UserIdInput from "../components/UserIdInput.jsx";

const STORAGE_KEY = "bookverse_user_id";

function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatisticsDashboard() {
  const currentYear = new Date().getFullYear();
  const [userId, setUserId] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "reader-001"
  );
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);

  const loadStatistics = useCallback(async () => {
    const trimmedUserId = userId.trim();

    if (!trimmedUserId) {
      setError("Please enter a reader ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await fetchReadingStatistics(
        trimmedUserId,
        year ? Number(year) : null
      );

      localStorage.setItem(STORAGE_KEY, trimmedUserId);
      setResponse(payload);
    } catch (fetchError) {
      setResponse(null);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [userId, year]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const data = response?.data;
  const summary = data?.summary;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
          Member 4 Feature
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">
          Reading Statistics Dashboard
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-stone-600">
          Live insights built from your reading progress and diary entries in
          MongoDB. No sample data is fabricated here.
        </p>
      </header>

      <UserIdInput
        userId={userId}
        onChange={setUserId}
        onSubmit={loadStatistics}
        loading={loading}
      />

      <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm sm:p-5">
        <label
          htmlFor="yearFilter"
          className="block text-sm font-medium text-stone-700"
        >
          Optional year filter
        </label>
        <select
          id="yearFilter"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none ring-amber-300 focus:ring-2 sm:max-w-xs"
        >
          <option value="">All time</option>
          {[currentYear, currentYear - 1, currentYear - 2].map((optionYear) => (
            <option key={optionYear} value={optionYear}>
              {optionYear}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {!loading && data && !data.hasData && (
        <EmptyState
          title="No reading data available yet"
          description="Start tracking your books to see your statistics. Create reading progress entries through the Member 3 API, then return here with the same reader ID."
        />
      )}

      {!loading && data?.hasData && summary && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Books Tracked" value={summary.totalBooks} />
            <StatCard label="Books Finished" value={summary.booksFinished} />
            <StatCard
              label="Currently Reading"
              value={summary.currentlyReading}
            />
            <StatCard label="Total Pages Read" value={summary.totalPagesRead} />
            <StatCard
              label="Avg Pages / Finished Book"
              value={summary.averagePagesPerFinishedBook}
            />
            <StatCard label="Diary Entries" value={summary.diaryEntries} />
            <StatCard
              label="Avg Completion Rate"
              value={`${summary.averageCompletionRate}%`}
            />
            <StatCard label="Want to Read" value={summary.wantToRead} />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <StatusBreakdown items={data.statusBreakdown} />
            <MonthlyChart items={data.monthlyFinished} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-stone-900">
                Recently Finished
              </h2>
              {data.recentlyFinished.length === 0 ? (
                <p className="mt-4 text-sm text-stone-500">
                  No finished books found for this filter.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.recentlyFinished.map((book) => (
                    <li
                      key={`${book.bookTitle}-${book.finishDate}`}
                      className="rounded-xl border border-stone-100 px-4 py-3"
                    >
                      <p className="font-medium text-stone-900">
                        {book.bookTitle}
                      </p>
                      <p className="text-sm text-stone-500">{book.author}</p>
                      <p className="mt-1 text-xs text-stone-400">
                        Finished {formatDate(book.finishDate)}
                        {book.totalPages ? ` · ${book.totalPages} pages` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-stone-900">
                In Progress
              </h2>
              {data.currentlyReading.length === 0 ? (
                <p className="mt-4 text-sm text-stone-500">
                  No active reading sessions right now.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.currentlyReading.map((book) => (
                    <li
                      key={`${book.bookTitle}-${book.startDate || "active"}`}
                      className="rounded-xl border border-stone-100 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-stone-900">
                            {book.bookTitle}
                          </p>
                          <p className="text-sm text-stone-500">
                            {book.author}
                          </p>
                        </div>
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                          {book.completionPercent}%
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-stone-400">
                        Page {book.currentPage}
                        {book.totalPages ? ` of ${book.totalPages}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default StatisticsDashboard;
