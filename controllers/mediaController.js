const ProfileMedia = require("../models/ProfileMedia");
const {
  uploadImage,
  deleteImage,
} = require("../config/mediaStorage");

const getOrCreateProfileMedia = async (userId) => {
  let profileMedia = await ProfileMedia.findOne({
    userId,
  });

  if (!profileMedia) {
    profileMedia = await ProfileMedia.create({
      userId,
    });
  }

  return profileMedia;
};

const getUserMedia = async (req, res) => {
  try {
    const profileMedia = await getOrCreateProfileMedia(
      req.params.userId
    );

    res.status(200).json({
      message: "Profile media fetched successfully",
      data: profileMedia,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile media",
      error: error.message,
    });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Profile picture file is required",
      });
    }

    const profileMedia = await getOrCreateProfileMedia(
      req.params.userId
    );

    if (profileMedia.profilePicturePublicId) {
      await deleteImage(profileMedia.profilePicturePublicId);
    }

    const uploadResult = await uploadImage(
      req.file.buffer,
      "profile-pictures",
      req.params.userId,
      req.file.originalname
    );

    profileMedia.profilePictureUrl = uploadResult.secure_url;
    profileMedia.profilePicturePublicId =
      uploadResult.public_id;

    const updatedMedia = await profileMedia.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      data: updatedMedia,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to upload profile picture",
      error: error.message,
    });
  }
};

const removeProfilePicture = async (req, res) => {
  try {
    const profileMedia = await ProfileMedia.findOne({
      userId: req.params.userId,
    });

    if (!profileMedia) {
      return res.status(404).json({
        message: "Profile media not found",
      });
    }

    if (profileMedia.profilePicturePublicId) {
      await deleteImage(profileMedia.profilePicturePublicId);

      profileMedia.profilePictureUrl = "";
      profileMedia.profilePicturePublicId = "";

      const updatedMedia = await profileMedia.save();

      return res.status(200).json({
        message: "Profile picture removed successfully",
        data: updatedMedia,
      });
    }

    res.status(200).json({
      message: "No profile picture to remove",
      data: profileMedia,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove profile picture",
      error: error.message,
    });
  }
};

const uploadListCover = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "List cover image file is required",
      });
    }

    const { listId, listTitle } = req.body;

    if (!listId) {
      return res.status(400).json({
        message: "listId is required",
      });
    }

    const profileMedia = await getOrCreateProfileMedia(
      req.params.userId
    );

    const existingCover = profileMedia.listCoverImages.find(
      (cover) => cover.listId === listId
    );

    if (existingCover?.publicId) {
      await deleteImage(existingCover.publicId);
    }

    const uploadResult = await uploadImage(
      req.file.buffer,
      "list-covers",
      req.params.userId,
      req.file.originalname
    );

    const coverData = {
      listId,
      listTitle: listTitle || "",
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };

    if (existingCover) {
      existingCover.listTitle = coverData.listTitle;
      existingCover.imageUrl = coverData.imageUrl;
      existingCover.publicId = coverData.publicId;
    } else {
      profileMedia.listCoverImages.push(coverData);
    }

    const updatedMedia = await profileMedia.save();

    res.status(200).json({
      message: "List cover uploaded successfully",
      data: updatedMedia,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to upload list cover",
      error: error.message,
    });
  }
};

const removeListCover = async (req, res) => {
  try {
    const profileMedia = await ProfileMedia.findOne({
      userId: req.params.userId,
    });

    if (!profileMedia) {
      return res.status(404).json({
        message: "Profile media not found",
      });
    }

    const coverEntry = profileMedia.listCoverImages.find(
      (cover) => cover.listId === req.params.listId
    );

    if (!coverEntry) {
      return res.status(404).json({
        message: "List cover not found",
      });
    }

    if (coverEntry.publicId) {
      await deleteImage(coverEntry.publicId);
    }

    profileMedia.listCoverImages =
      profileMedia.listCoverImages.filter(
        (cover) => cover.listId !== req.params.listId
      );

    const updatedMedia = await profileMedia.save();

    res.status(200).json({
      message: "List cover removed successfully",
      data: updatedMedia,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove list cover",
      error: error.message,
    });
  }
};

const getMyMedia = async (req, res) => {
  req.params.userId = req.user.userId;
  return getUserMedia(req, res);
};

module.exports = {
  getUserMedia,
  getMyMedia,
  uploadProfilePicture,
  removeProfilePicture,
  uploadListCover,
  removeListCover,
};
