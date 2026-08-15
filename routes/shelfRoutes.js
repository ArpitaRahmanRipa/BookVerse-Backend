const express = require("express");

const {
  addBookToShelf,
  getUserShelves,
} = require("../controllers/shelfController");

const router = express.Router();

router.post("/", addBookToShelf);

router.get("/:userId", getUserShelves);

module.exports = router;