const express = require("express");

const {
  followReader,
  getFollowingList,
  getFollowersList,
  getConnectionCounts,
  getFollowStatus,
  getFollowingActivity,
  unfollowReader,
} = require("../controllers/followController");

const router = express.Router();

// Follow a reader
router.post(
  "/follow",
  followReader
);

// Get everyone a user is following
router.get(
  "/following/:userId",
  getFollowingList
);

// Get followers of a user
router.get(
  "/followers/:userId",
  getFollowersList
);

// Get follower + following counts
router.get(
  "/connections/:userId/counts",
  getConnectionCounts
);

// Check whether one user follows another
router.get(
  "/follow-status/:userId/:targetUserId",
  getFollowStatus
);

// Get reading activity from followed readers
router.get(
  "/following/:userId/activity",
  getFollowingActivity
);

// Unfollow a reader
router.delete(
  "/follow/:userId/:targetUserId",
  unfollowReader
);

module.exports = router;