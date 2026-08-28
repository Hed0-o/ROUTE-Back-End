import fs from "fs";
import path from "path";
import multer from "multer";

const uploadFolders = ["imgs", "videos", "general"];

const uploadPath = path.join(process.cwd(), "uploads");

export const multerLocal = () => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  uploadFolders.forEach((folder) => {
    const folderPath = path.join(uploadPath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const requestedFolder = req.query.folder;
      const folder = uploadFolders.includes(requestedFolder)
        ? requestedFolder
        : "general";
      const destination = path.join(uploadPath, folder);
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WEBP images are allowed"), false);
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

  return upload;
};
