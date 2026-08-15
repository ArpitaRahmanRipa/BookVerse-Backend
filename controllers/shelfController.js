const BookShelf = require("../models/BookShelf");

const addBookToShelf = async (req, res) => {
  try {
    const {
      userId,
      bookId,
      bookTitle,
      authors,
      coverImage,
      shelf,
    } = req.body;

    if (!userId || !bookId || !bookTitle || !shelf) {
      return res.status(400).json({
        success: false,
        message: "Required shelf information is missing.",
      });
    }

    let savedBook = await BookShelf.findOne({
      userId,
      bookId,
    });

    if (savedBook) {
      savedBook.shelf = shelf;
      savedBook.bookTitle = bookTitle;
      savedBook.authors = authors || [];
      savedBook.coverImage = coverImage || "";

      await savedBook.save();

      return res.status(200).json({
        success: true,
        message: `Book moved to "${shelf}".`,
        data: savedBook,
      });
    }

    savedBook = await BookShelf.create({
      userId,
      bookId,
      bookTitle,
      authors: authors || [],
      coverImage: coverImage || "",
      shelf,
    });

    return res.status(201).json({
      success: true,
      message: `Book added to "${shelf}".`,
      data: savedBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to add book to shelf.",
      error: error.message,
    });
  }
};

const getUserShelves = async (req, res) => {
  try {
    const books = await BookShelf.find({
      userId: req.params.userId,
    });

    return res.status(200).json({
      success: true,
      results: books.length,
      books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve shelves.",
      error: error.message,
    });
  }
};

module.exports = {
  addBookToShelf,
  getUserShelves,
};