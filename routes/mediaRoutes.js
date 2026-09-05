const express = require("express");
const multer = require("multer");

const {
  getUserMedia,
  getMyMedia,
  uploadProfilePicture,
  removeProfilePicture,
  uploadListCover,
  removeListCover,
} = require("../controllers/mediaController");
const {
  authenticate,
  requireSelfOrAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Only image files are allowed"));
      return;
    }

    callback(null, true);
  },
});

router.get("/me", authenticate, getMyMedia);
router.get(
  "/user/:userId",
  authenticate,
  requireSelfOrAdmin("userId"),
  getUserMedia
);

router.post(
  "/profile/:userId",
  authenticate,
  requireSelfOrAdmin("userId"),
  upload.single("profilePicture"),
  uploadProfilePicture
);

router.delete(
  "/profile/:userId",
  authenticate,
  requireSelfOrAdmin("userId"),
  removeProfilePicture
);

router.post(
  "/list-cover/:userId",
  authenticate,
  requireSelfOrAdmin("userId"),
  upload.single("listCover"),
  uploadListCover
);

router.delete(
  "/list-cover/:userId/:listId",
  authenticate,
  requireSelfOrAdmin("userId"),
  removeListCover
);

module.exports = router;
