const {
  cloudinary,
  isCloudinaryConfigured,
} = require("./cloudinary");
const {
  saveLocalImage,
  deleteLocalImage,
} = require("../utils/localMediaStorage");

const uploadImage = async (fileBuffer, folder, userId, originalName) => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `bookverse/${folder}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  return saveLocalImage(
    fileBuffer,
    folder,
    userId,
    originalName
  );
};

const deleteImage = async (publicId) => {
  if (!publicId) {
    return;
  }

  if (isCloudinaryConfigured()) {
    await cloudinary.uploader.destroy(publicId);
    return;
  }

  await deleteLocalImage(publicId);
};

module.exports = {
  isCloudinaryConfigured,
  uploadImage,
  deleteImage,
};
