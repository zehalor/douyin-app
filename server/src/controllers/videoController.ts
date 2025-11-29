import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 发布视频
export const createVideo = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // 检查必传的视频文件
    if (!files || !files.video || files.video.length === 0) {
      return res.status(400).json({ error: "未上传视频文件" });
    }

    const videoFile = files.video[0];
    const coverFile = files.cover ? files.cover[0] : null; // 封面是可选的

    const { title, description, ratio } = req.body;

    const authorId = req.userId!;

    const videoUrl = `http://localhost:3000/uploads/${videoFile.filename}`;
    const coverUrl = coverFile
      ? `http://localhost:3000/uploads/${coverFile.filename}`
      : null;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        coverUrl,
        ratio: ratio || "3/4",
        authorId: Number(authorId),
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
    const { keyword, sort } = req.query;

    const whereCondition = keyword
      ? {
          OR: [
            { title: { contains: String(keyword) } },
            { description: { contains: String(keyword) } },
          ],
        }
      : {};

    const orderBy =
      sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

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

    // 尝试物理删除相关文件 (包括视频和封面)
    const filesToDelete = [video.videoUrl];
    if (video.coverUrl) filesToDelete.push(video.coverUrl);

    filesToDelete.forEach((url) => {
      try {
        const filename = path.basename(url);
        const filepath = path.join(__dirname, "../../uploads", filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      } catch (err) {
        console.warn(`Failed to delete file: ${url}`, err);
      }
    });

    await prisma.video.delete({ where: { id } });

    res.json({ message: "删除成功" });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ error: "删除失败" });
  }
};

// 更新视频信息
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

// 获取视频详情
export const getVideoById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        author: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
        likes: true,
      },
    });

    if (!video) return res.status(404).json({ error: "视频不存在" });

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: "获取详情失败" });
  }
};

// 点赞/取消点赞
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const videoId = Number(req.params.id);

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: { userId, videoId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      res.json({ isLiked: false });
    } else {
      await prisma.like.create({ data: { userId, videoId } });
      res.json({ isLiked: true });
    }
  } catch (error) {
    res.status(500).json({ error: "操作失败" });
  }
};

// 发表评论
export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const videoId = Number(req.params.id);
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: { content, userId, videoId },
      include: { user: true },
    });

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "评论失败" });
  }
};
