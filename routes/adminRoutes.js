const express = require("express");

const {
  getPlatformAnalytics,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/analytics", getPlatformAnalytics);

router.get("/categories", getCategories);

router.post("/categories", createCategory);

router.put(
  "/categories/:categoryId",
  updateCategory
);

router.delete(
  "/categories/:categoryId",
  deleteCategory
);

module.exports = router;
