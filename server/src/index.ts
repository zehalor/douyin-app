import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import videoRoutes from "./routes/videoRoutes";

const app = express();
const port = 3000;

// 基础中间件配置
app.use(cors());
app.use(express.json());

// 静态资源目录 (公开 uploads 文件夹)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 路由挂载
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

// 启动服务
app.listen(port, () => {
  console.log(`服务已启动：http://localhost:${port}`);
});
