const Follow = require("../models/Follow");
const ReadingProgress = require("../models/ReadingProgress");
const {
  createNotificationRecord,
} = require("./notificationController");

// ==============================
// Follow a reader
// ==============================

const followReader = async (req, res) => {
  try {
    const {
      userId,
      userName,
      targetUserId,
      targetName,
      targetUsername,
    } = req.body;

    if (!userId || !targetUserId) {
      return res.status(400).json({
        message:
          "userId and targetUserId are required",
      });
    }

    // A reader cannot follow themselves.
    if (userId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    // Check before attempting to create.
    const existingFollow = await Follow.findOne({
      userId,
      targetUserId,
    });

    if (existingFollow) {
      return res.status(409).json({
        message: "This reader is already followed",
      });
    }

    const follow = await Follow.create({
      userId,
      targetUserId,
      targetName: targetName || "",
      targetUsername: targetUsername || "",
    });

    // Automatically notify the reader who was followed.
    try {
      const followerDisplayName =
        userName || userId;

      await createNotificationRecord({
        recipientId: targetUserId,
        actorId: userId,
        actorName: followerDisplayName,
        type: "follow",
        message: `${followerDisplayName} started following you.`,
        relatedId: userId,
        relatedType: "user",
        link: "/connections",
      });
    } catch (notificationError) {
      // The Follow should still succeed even if
      // creating the notification fails.
      console.error(
        "Failed to create follow notification:",
        notificationError.message
      );
    }

    return res.status(201).json({
      message: "Reader followed successfully",
      data: follow,
    });
  } catch (error) {
    // Backup protection from the unique DB index.
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This reader is already followed",
      });
    }

    return res.status(500).json({
      message: "Failed to follow reader",
      error: error.message,
    });
  }
};

// ==============================
// Get readers followed by a user
// ==============================

const getFollowingList = async (req, res) => {
  try {
    const followingList = await Follow.find({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message:
        "Following list fetched successfully",
      count: followingList.length,
      data: followingList,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch following list",
      error: error.message,
    });
  }
};

// ==============================
// Get followers of a reader
// ==============================

const getFollowersList = async (req, res) => {
  try {
    const followersList = await Follow.find({
      targetUserId: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message:
        "Followers list fetched successfully",
      count: followersList.length,
      data: followersList,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch followers list",
      error: error.message,
    });
  }
};

// ==============================
// Get follower/following counts
// ==============================

const getConnectionCounts = async (req, res) => {
  try {
    const { userId } = req.params;

    const [followers, following] =
      await Promise.all([
        Follow.countDocuments({
          targetUserId: userId,
        }),

        Follow.countDocuments({
          userId,
        }),
      ]);

    return res.status(200).json({
      userId,
      followers,
      following,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to fetch connection counts",
      error: error.message,
    });
  }
};

// ==============================
// Check whether one reader
// follows another reader
// ==============================

const getFollowStatus = async (req, res) => {
  try {
    const {
      userId,
      targetUserId,
    } = req.params;

    const follow = await Follow.findOne({
      userId,
      targetUserId,
    });

    return res.status(200).json({
      isFollowing: Boolean(follow),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to check follow status",
      error: error.message,
    });
  }
};

// ==============================
// Unfollow a reader
// ==============================

const unfollowReader = async (req, res) => {
  try {
    const {
      userId,
      targetUserId,
    } = req.params;

    const deletedFollow =
      await Follow.findOneAndDelete({
        userId,
        targetUserId,
      });

    if (!deletedFollow) {
      return res.status(404).json({
        message: "Follow record not found",
      });
    }

    return res.status(200).json({
      message: "Reader unfollowed successfully",
      data: deletedFollow,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to unfollow reader",
      error: error.message,
    });
  }
};

// ==============================
// Reading activity from people
// the current user follows
// ==============================

const getFollowingActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: find everybody this user follows.
    const following = await Follow.find({
      userId,
    });

    const followedUserIds = following.map(
      (follow) => follow.targetUserId
    );

    if (followedUserIds.length === 0) {
      return res.status(200).json({
        message:
          "You are not following any readers yet",
        data: [],
      });
    }

    // Step 2: get their reading progress.
    const progressRecords =
      await ReadingProgress.find({
        userId: {
          $in: followedUserIds,
        },
      }).sort({
        updatedAt: -1,
      });

    // Step 3: convert progress records into
    // simple social activity items.
    const activities = [];

    progressRecords.forEach((progress) => {
      if (progress.status === "Finished") {
        activities.push({
          type: "completed_book",
          userId: progress.userId,
          bookId: progress.bookId,
          bookTitle: progress.bookTitle,
          author: progress.author,
          bookCover: progress.bookCover,
          status: progress.status,
          finishDate: progress.finishDate,
          rating: progress.rating,
          createdAt:
            progress.finishDate ||
            progress.updatedAt,
        });
      } else {
        activities.push({
          type: "reading_progress",
          userId: progress.userId,
          bookId: progress.bookId,
          bookTitle: progress.bookTitle,
          author: progress.author,
          bookCover: progress.bookCover,
          currentPage: progress.currentPage,
          totalPages: progress.totalPages,
          status: progress.status,
          createdAt: progress.updatedAt,
        });
      }

      // Public diary notes can also act as
      // reading milestone/activity entries.
      if (
        Array.isArray(progress.diaryEntries)
      ) {
        progress.diaryEntries.forEach(
          (entry) => {
            if (
              entry.visibility === "Public"
            ) {
              activities.push({
                type: "reading_milestone",
                userId: progress.userId,
                bookId: progress.bookId,
                bookTitle:
                  progress.bookTitle,
                note: entry.note,
                pageNumber:
                  entry.pageNumber,
                createdAt:
                  entry.entryDate,
              });
            }
          }
        );
      }
    });

    // Newest activity first.
    activities.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    return res.status(200).json({
      message:
        "Following activity fetched successfully",
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Failed to fetch following activity",
      error: error.message,
    });
  }
};

module.exports = {
  followReader,
  getFollowingList,
  getFollowersList,
  getConnectionCounts,
  getFollowStatus,
  unfollowReader,
  getFollowingActivity,
};