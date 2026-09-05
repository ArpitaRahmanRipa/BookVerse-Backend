const ReadingProgress = require("../models/ReadingProgress");

// ========================================
// Generate Yearly Reading Wrapped
// ========================================

const getYearlyReadingWrapped = async (req, res) => {
  try {
    const { userId } = req.params;
    const year = Number(req.query.year) || new Date().getFullYear();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // ----------------------------------------
    // Start and end of requested year
    // ----------------------------------------

    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const startOfNextYear = new Date(
      `${year + 1}-01-01T00:00:00.000Z`
    );

    // ----------------------------------------
    // Get books finished during this year
    // ----------------------------------------

    const finishedBooks = await ReadingProgress.find({
      userId,
      status: "Finished",
      finishDate: {
        $gte: startOfYear,
        $lt: startOfNextYear,
      },
    }).sort({
      finishDate: 1,
    });

    // ----------------------------------------
    // Total books
    // ----------------------------------------

    const totalBooksRead = finishedBooks.length;

    // ----------------------------------------
    // Total pages
    // ----------------------------------------

    const totalPagesRead = finishedBooks.reduce(
      (total, book) => total + (Number(book.totalPages) || 0),
      0
    );

    // ----------------------------------------
    // Highest-rated books
    // ----------------------------------------

    const ratedBooks = finishedBooks
      .filter(
        (book) =>
          book.rating !== null &&
          book.rating !== undefined
      )
      .sort((a, b) => b.rating - a.rating);

    const highestRatedBooks = ratedBooks
      .slice(0, 5)
      .map((book) => ({
        bookId: book.bookId,
        title: book.bookTitle,
        author: book.author,
        rating: book.rating,
      }));

    // ----------------------------------------
    // Favorite authors
    // ----------------------------------------

    const authorCounts = {};

    finishedBooks.forEach((book) => {
      const author = book.author?.trim();

      if (!author) {
        return;
      }

      authorCounts[author] =
        (authorCounts[author] || 0) + 1;
    });

    const favoriteAuthors = Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([author, booksRead]) => ({
        author,
        booksRead,
      }));

    // ----------------------------------------
    // Most active reading month
    // ----------------------------------------

    const monthCounts = {};

    finishedBooks.forEach((book) => {
      if (!book.finishDate) {
        return;
      }

      const month = new Date(book.finishDate).getUTCMonth();

      monthCounts[month] =
        (monthCounts[month] || 0) + 1;
    });

    let mostActiveMonth = null;

    if (Object.keys(monthCounts).length > 0) {
      const [monthNumber, booksRead] =
        Object.entries(monthCounts).sort(
          (a, b) => b[1] - a[1]
        )[0];

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      mostActiveMonth = {
        month: monthNames[Number(monthNumber)],
        booksRead,
      };
    }

    // ----------------------------------------
    // Reading achievements
    // ----------------------------------------

    const achievements = [];

    if (totalBooksRead >= 1) {
      achievements.push({
        title: "First Book",
        description:
          "Finished your first book of the year.",
      });
    }

    if (totalBooksRead >= 5) {
      achievements.push({
        title: "Book Explorer",
        description:
          "Finished at least 5 books this year.",
      });
    }

    if (totalBooksRead >= 10) {
      achievements.push({
        title: "Avid Reader",
        description:
          "Finished at least 10 books this year.",
      });
    }

    if (totalBooksRead >= 20) {
      achievements.push({
        title: "Reading Champion",
        description:
          "Finished at least 20 books this year.",
      });
    }

    if (totalPagesRead >= 1000) {
      achievements.push({
        title: "Page Turner",
        description:
          "Read at least 1,000 pages this year.",
      });
    }

    if (totalPagesRead >= 5000) {
      achievements.push({
        title: "Page Master",
        description:
          "Read at least 5,000 pages this year.",
      });
    }

    // ----------------------------------------
    // Return Wrapped summary
    // ----------------------------------------

    return res.status(200).json({
      success: true,

      data: {
        userId,
        year,

        totalBooksRead,
        totalPagesRead,

        topGenres: [],

        highestRatedBooks,

        mostActiveMonth,

        favoriteAuthors,

        achievements,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to generate yearly reading wrapped.",
      error: error.message,
    });
  }
};

module.exports = {
  getYearlyReadingWrapped,
};