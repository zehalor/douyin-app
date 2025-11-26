import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";

// 确保上传目录存在
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer 存储配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名 (时间戳 + 随机数)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({ storage });
