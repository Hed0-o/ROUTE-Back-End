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
      const ext = path.extname(file.originalname).toLowerCase();
      let folder = "general";
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        folder = "imgs";
      } else if ([".mp4", ".mov", ".avi", ".mkv", ".webm"].includes(ext)) {
        folder = "videos";
      }
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
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/webm",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
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
