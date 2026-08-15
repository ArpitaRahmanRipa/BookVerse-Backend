const ReadingProgress = require("../models/ReadingProgress");

const normalizeStatus = (status) => {
  const value = (status || "Currently Reading").trim().toLowerCase();

  if (value.includes("finish")) {
    return "Finished";
  }

  if (value.includes("want")) {
    return "Want to Read";
  }

  if (value.includes("dnf") || value.includes("did not")) {
    return "Did Not Finish";
  }

  return "Currently Reading";
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

const getMonthKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const getPagesRead = (entry) => {
  const status = normalizeStatus(entry.status);

  if (status === "Finished") {
    return entry.totalPages || entry.currentPage || 0;
  }

  return entry.currentPage || 0;
};

const getCompletionPercent = (entry) => {
  if (!entry.totalPages || entry.totalPages <= 0) {
    return null;
  }

  const current = entry.currentPage || 0;
  return Math.min(100, Math.round((current / entry.totalPages) * 100));
};

const buildEmptyStatistics = () => ({
  hasData: false,
  summary: {
    totalBooks: 0,
    booksFinished: 0,
    currentlyReading: 0,
    wantToRead: 0,
    didNotFinish: 0,
    totalPagesRead: 0,
    averagePagesPerFinishedBook: 0,
    diaryEntries: 0,
    averageCompletionRate: 0,
  },
  statusBreakdown: [],
  monthlyFinished: [],
  recentlyFinished: [],
  currentlyReading: [],
});

const getReadingStatistics = async (req, res) => {
  try {
    const { userId } = req.params;
    const yearFilter = req.query.year
      ? Number.parseInt(req.query.year, 10)
      : null;

    if (!userId || !userId.trim()) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (yearFilter !== null && Number.isNaN(yearFilter)) {
      return res.status(400).json({
        message: "Year must be a valid number",
      });
    }

    const progressList = await ReadingProgress.find({
      userId: userId.trim(),
    }).sort({ updatedAt: -1 });

    if (progressList.length === 0) {
      return res.status(200).json({
        message:
          "No reading data available yet. Start tracking your books to see your statistics.",
        data: buildEmptyStatistics(),
      });
    }

    const statusCounts = {
      Finished: 0,
      "Currently Reading": 0,
      "Want to Read": 0,
      "Did Not Finish": 0,
    };

    let totalPagesRead = 0;
    let diaryEntries = 0;
    let completionTotal = 0;
    let completionCount = 0;
    const monthlyMap = new Map();
    const recentlyFinished = [];
    const currentlyReading = [];

    progressList.forEach((entry) => {
      const status = normalizeStatus(entry.status);
      statusCounts[status] += 1;

      totalPagesRead += getPagesRead(entry);

      if (entry.diaryNote && entry.diaryNote.trim()) {
        diaryEntries += 1;
      }

      const completionPercent = getCompletionPercent(entry);

      if (completionPercent !== null) {
        completionTotal += completionPercent;
        completionCount += 1;
      }

      if (status === "Finished") {
        const finishDate =
          parseDate(entry.finishDate) || parseDate(entry.updatedAt);

        if (finishDate) {
          const monthKey = getMonthKey(finishDate);

          if (
            yearFilter === null ||
            finishDate.getFullYear() === yearFilter
          ) {
            monthlyMap.set(
              monthKey,
              (monthlyMap.get(monthKey) || 0) + 1
            );
          }
        }

        if (
          yearFilter === null ||
          (finishDate && finishDate.getFullYear() === yearFilter)
        ) {
          recentlyFinished.push({
            bookTitle: entry.bookTitle,
            author: entry.author || "Unknown author",
            finishDate: entry.finishDate || entry.updatedAt,
            totalPages: entry.totalPages || 0,
          });
        }
      }

      if (status === "Currently Reading") {
        currentlyReading.push({
          bookTitle: entry.bookTitle,
          author: entry.author || "Unknown author",
          currentPage: entry.currentPage || 0,
          totalPages: entry.totalPages || 0,
          completionPercent: completionPercent || 0,
          startDate: entry.startDate || null,
        });
      }
    });

    recentlyFinished.sort((a, b) => {
      const dateA = parseDate(a.finishDate)?.getTime() || 0;
      const dateB = parseDate(b.finishDate)?.getTime() || 0;
      return dateB - dateA;
    });

    const booksFinished = statusCounts.Finished;
    const finishedPagesTotal = progressList
      .filter((entry) => normalizeStatus(entry.status) === "Finished")
      .reduce(
        (sum, entry) => sum + (entry.totalPages || entry.currentPage || 0),
        0
      );

    const statusBreakdown = Object.entries(statusCounts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        status,
        count,
      }));

    const monthlyFinished = Array.from(monthlyMap.entries())
      .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
      .map(([month, count]) => ({
        month,
        count,
      }));

    res.status(200).json({
      message: "Reading statistics fetched successfully",
      data: {
        hasData: true,
        yearFilter,
        summary: {
          totalBooks: progressList.length,
          booksFinished,
          currentlyReading: statusCounts["Currently Reading"],
          wantToRead: statusCounts["Want to Read"],
          didNotFinish: statusCounts["Did Not Finish"],
          totalPagesRead,
          averagePagesPerFinishedBook:
            booksFinished > 0
              ? Math.round(finishedPagesTotal / booksFinished)
              : 0,
          diaryEntries,
          averageCompletionRate:
            completionCount > 0
              ? Math.round(completionTotal / completionCount)
              : 0,
        },
        statusBreakdown,
        monthlyFinished,
        recentlyFinished: recentlyFinished.slice(0, 5),
        currentlyReading: currentlyReading.slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reading statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getReadingStatistics,
};
