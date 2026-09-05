const express = require("express");

const {
  getPlatformAnalytics,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/adminController");
const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles("Admin"));

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
