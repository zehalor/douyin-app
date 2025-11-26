import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 发布视频
export const createVideo = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "未上传视频文件" });
    }

    const { title, description, category } = req.body;

    // FIXME: 这里目前先写死 ID=1 方便调试。
    // 等后面 Auth 中间件写好了，记得回来改成 const authorId = req.userId;
    const authorId = 1;

    // 生成访问 URL
    const videoUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        category: category || "默认", // 如果没传分类，就存为"默认"
        authorId: Number(authorId),
        // views 默认为 0，不需要手动传
      },
    });

    res.status(201).json(video);
  } catch (error) {
    console.error("Create video error:", error);
    res.status(500).json({ error: "发布失败" });
  }
};

// 获取视频列表
export const getVideos = async (req: Request, res: Response) => {
  try {
    const { keyword, sort, category } = req.query;

    // 构造查询条件
    const whereCondition: any = {};

    if (keyword) {
      // 标题或简介里包含关键词都算
      whereCondition.OR = [
        { title: { contains: String(keyword) } },
        { description: { contains: String(keyword) } },
      ];
    }

    if (category) {
      whereCondition.category = String(category);
    }

    // 排序逻辑
    let orderBy = {};
    switch (sort) {
      case "most_viewed":
        orderBy = { views: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      default:
        // 默认按最新发布排
        orderBy = { createdAt: "desc" };
    }

    const videos = await prisma.video.findMany({
      where: whereCondition,
      include: { author: true },
      orderBy: orderBy as any,
    });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "获取列表失败" });
  }
};

// 删除视频
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
      return res.status(404).json({ error: "视频不存在" });
    }

    // 物理删除文件
    try {
      const filename = path.basename(video.videoUrl);
      const filepath = path.join(__dirname, "../../uploads", filename);

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (err) {
      console.warn("物理文件删除失败，请手动检查:", err);
    }

    // 删除数据库记录
    await prisma.video.delete({ where: { id } });

    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ error: "删除失败" });
  }
};

// 更新视频
export const updateVideo = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body;

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: { title, description },
    });

    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ error: "更新失败" });
  }
};
