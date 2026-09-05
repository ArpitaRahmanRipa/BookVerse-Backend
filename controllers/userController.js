const User = require("../models/User");


// ==============================
// Update Current User Profile
// ==============================

const updateCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    const {
      name,
      bio,
      favoriteGenres,
      readingGoal,
      privacy,
    } = req.body;


    // Name

    if (name !== undefined) {
      const trimmedName = String(name).trim();

      if (!trimmedName) {
        return res.status(400).json({
          message: "Name cannot be empty.",
        });
      }

      user.name = trimmedName;
    }


    // Bio

    if (bio !== undefined) {
      user.bio = String(bio).trim();
    }


    // Favorite Genres

    if (favoriteGenres !== undefined) {
      if (!Array.isArray(favoriteGenres)) {
        return res.status(400).json({
          message:
            "favoriteGenres must be an array.",
        });
      }

      user.favoriteGenres = favoriteGenres
        .map((genre) =>
          String(genre).trim()
        )
        .filter(Boolean);
    }


    // Reading Goal

    if (readingGoal !== undefined) {
      const numericGoal =
        Number(readingGoal);

      if (
        Number.isNaN(numericGoal) ||
        numericGoal < 0
      ) {
        return res.status(400).json({
          message:
            "Reading goal must be 0 or greater.",
        });
      }

      user.readingGoal = numericGoal;
    }


    // Privacy

    if (privacy !== undefined) {
      if (
        !["Public", "Private"].includes(
          privacy
        )
      ) {
        return res.status(400).json({
          message:
            "Privacy must be Public or Private.",
        });
      }

      user.privacy = privacy;
    }


    const updatedUser =
      await user.save();


    return res.status(200).json({
      message:
        "Profile updated successfully.",
      user: {
        _id: updatedUser._id,
        userId: updatedUser.userId,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        bio: updatedUser.bio,
        favoriteGenres:
          updatedUser.favoriteGenres,
        readingGoal:
          updatedUser.readingGoal,
        privacy: updatedUser.privacy,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });

  } catch (error) {

    return res.status(500).json({
      message:
        "Failed to update profile.",
      error: error.message,
    });

  }
};


// ==============================
// Get Public User Profile
// ==============================

const getPublicUserProfile = async (
  req,
  res
) => {
  try {
    const user = await User.findOne({
      userId: req.params.userId,
      isActive: true,
    });


    if (!user) {
      return res.status(404).json({
        message:
          "BookVerse user not found.",
      });
    }


    const profile = {
      userId: user.userId,
      name: user.name,
      username: user.username,
      role: user.role,
      bio: user.bio,
      favoriteGenres:
        user.favoriteGenres,
      privacy: user.privacy,
      createdAt: user.createdAt,
    };


    // Private profiles expose only
    // basic identity information.

    if (user.privacy === "Private") {
      return res.status(200).json({
        message:
          "Private profile fetched successfully.",
        user: {
          userId: user.userId,
          name: user.name,
          username: user.username,
          role: user.role,
          privacy: user.privacy,
        },
      });
    }


    return res.status(200).json({
      message:
        "Public profile fetched successfully.",
      user: profile,
    });

  } catch (error) {

    return res.status(500).json({
      message:
        "Failed to fetch user profile.",
      error: error.message,
    });

  }
};


module.exports = {
  updateCurrentUser,
  getPublicUserProfile,
};