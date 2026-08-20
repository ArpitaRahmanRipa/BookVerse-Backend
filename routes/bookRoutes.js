const express = require("express");

const {
    searchBooks,
    getBookDetails
} = require("../controllers/bookController");

const router = express.Router();

// Search must come before /:id
router.get("/search", searchBooks);

// Get one book
router.get("/:id", getBookDetails);

module.exports = router;