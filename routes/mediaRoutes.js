const express = require("express");
const multer = require("multer");

const {
  getUserMedia,
  uploadProfilePicture,
  removeProfilePicture,
  uploadListCover,
  removeListCover,
} = require("../controllers/mediaController");

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

router.get("/user/:userId", getUserMedia);

router.post(
  "/profile/:userId",
  upload.single("profilePicture"),
  uploadProfilePicture
);

router.delete(
  "/profile/:userId",
  removeProfilePicture
);

router.post(
  "/list-cover/:userId",
  upload.single("listCover"),
  uploadListCover
);

router.delete(
  "/list-cover/:userId/:listId",
  removeListCover
);

module.exports = router;
