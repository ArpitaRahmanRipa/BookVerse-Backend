const User = require("../models/User");


// ==============================
// Get All Users
// Admin Only
// ==============================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    .select("-passwordHash")
    .sort({ createdAt: -1 });

    return res.status(200).json({
      message:
        "BookVerse users fetched successfully.",
      count: users.length,
      data: users,
    });

  } catch (error) {

    return res.status(500).json({
      message:
        "Failed to fetch BookVerse users.",
      error: error.message,
    });

  }
};


// ==============================
// Change User Role
// Admin Only
// ==============================

const updateUserRole = async (req, res) => {
  try {
    const {
      role,
    } = req.body;


    const allowedRoles = [
      "Reader",
      "Community Moderator",
      "Admin",
    ];


    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message:
          "Role must be Reader, Community Moderator, or Admin.",
      });
    }


    const user = await User.findById(
      req.params.userId
    );


    if (!user) {
      return res.status(404).json({
        message:
          "BookVerse user not found.",
      });
    }


    // Prevent an admin from accidentally
    // removing their own Admin role.

    if (
      user._id.toString() ===
        req.user._id.toString() &&
      role !== "Admin"
    ) {
      return res.status(400).json({
        message:
          "You cannot remove your own Admin role.",
      });
    }


    user.role = role;

    const updatedUser =
      await user.save();


    return res.status(200).json({
      message:
        "User role updated successfully.",
      user: updatedUser,
    });

  } catch (error) {

    return res.status(500).json({
      message:
        "Failed to update user role.",
      error: error.message,
    });

  }
};


// ==============================
// Activate / Deactivate User
// Admin Only
// ==============================

const updateUserStatus = async (req, res) => {
  try {
    const {
      isActive,
    } = req.body;


    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message:
          "isActive must be true or false.",
      });
    }


    const user = await User.findById(
      req.params.userId
    );


    if (!user) {
      return res.status(404).json({
        message:
          "BookVerse user not found.",
      });
    }


    // Prevent an admin from
    // deactivating their own account.

    if (
      user._id.toString() ===
        req.user._id.toString() &&
      isActive === false
    ) {
      return res.status(400).json({
        message:
          "You cannot deactivate your own Admin account.",
      });
    }


    user.isActive = isActive;

    const updatedUser =
      await user.save();


    return res.status(200).json({
      message:
        isActive
          ? "User account activated successfully."
          : "User account deactivated successfully.",
      user: updatedUser,
    });

  } catch (error) {

    return res.status(500).json({
      message:
        "Failed to update user account status.",
      error: error.message,
    });

  }
};


module.exports = {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
};