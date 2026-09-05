const fs = require("fs/promises");
const path = require("path");

const UPLOAD_ROOT = path.join(__dirname, "../uploads");

const getLocalMediaBaseUrl = () => {
  if (process.env.API_PUBLIC_URL) {
    return process.env.API_PUBLIC_URL.replace(/\/$/, "");
  }

  const port = process.env.PORT || 3000;
  return `http://127.0.0.1:${port}`;
};

const ensureUploadDir = async (folder) => {
  const dir = path.join(UPLOAD_ROOT, folder);
  await fs.mkdir(dir, { recursive: true });
  return dir;
};

const buildFileName = (userId, originalName) => {
  const extension = path.extname(originalName || "").toLowerCase() || ".jpg";
  const safeUserId = String(userId).replace(/[^\w-]/g, "");
  return `${safeUserId}-${Date.now()}${extension}`;
};

const saveLocalImage = async (fileBuffer, folder, userId, originalName) => {
  const dir = await ensureUploadDir(folder);
  const fileName = buildFileName(userId, originalName);
  const filePath = path.join(dir, fileName);

  await fs.writeFile(filePath, fileBuffer);

  const relativePath = `/uploads/${folder}/${fileName}`;

  return {
    secure_url: `${getLocalMediaBaseUrl()}${relativePath}`,
    public_id: relativePath,
  };
};

const deleteLocalImage = async (publicId) => {
  if (!publicId || !publicId.startsWith("/uploads/")) {
    return;
  }

  const filePath = path.join(__dirname, "..", publicId.replace(/^\//, ""));

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

module.exports = {
  UPLOAD_ROOT,
  saveLocalImage,
  deleteLocalImage,
};
