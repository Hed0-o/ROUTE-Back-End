import fs from "fs/promises";

const deleteFile = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
};

export default deleteFile;
