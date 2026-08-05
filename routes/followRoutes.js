const express = require("express");

const {
  followReader,
  getFollowingList,
  getFollowersList,
  unfollowReader,
} = require("../controllers/followController");

const router = express.Router();

router.post("/follow", followReader);

router.get("/following/:userId", getFollowingList);

router.get("/followers/:targetUserId", getFollowersList);

router.delete(
  "/follow/:userId/:targetUserId",
  unfollowReader
);

module.exports = router;