const Follow = require("../models/Follow");

// Follow a reader
const followReader = async (req, res) => {
  try {
    const follow = new Follow(req.body);
    const savedFollow = await follow.save();

    res.status(201).json({
      message: "Reader followed successfully",
      data: savedFollow,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This reader is already followed",
      });
    }

    res.status(400).json({
      message: "Failed to follow reader",
      error: error.message,
    });
  }
};

// Get readers followed by a user
const getFollowingList = async (req, res) => {
  try {
    const followingList = await Follow.find({
      userId: req.params.userId,
    });

    res.status(200).json({
      message: "Following list fetched successfully",
      data: followingList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch following list",
      error: error.message,
    });
  }
};

// Get followers of a reader
const getFollowersList = async (req, res) => {
  try {
    const followersList = await Follow.find({
      targetUserId: req.params.targetUserId,
    });

    res.status(200).json({
      message: "Followers list fetched successfully",
      data: followersList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch followers list",
      error: error.message,
    });
  }
};

// Unfollow a reader
const unfollowReader = async (req, res) => {
  try {
    const deletedFollow = await Follow.findOneAndDelete({
      userId: req.params.userId,
      targetUserId: req.params.targetUserId,
    });

    if (!deletedFollow) {
      return res.status(404).json({
        message: "Follow record not found",
      });
    }

    res.status(200).json({
      message: "Reader unfollowed successfully",
      data: deletedFollow,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to unfollow reader",
      error: error.message,
    });
  }
};

module.exports = {
  followReader,
  getFollowingList,
  getFollowersList,
  unfollowReader,
};