import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const JWT_SECRET = "SECRET_KEY";

// 用户注册
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "用户名和密码不能为空" });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "用户名已存在" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      },
    });

    res.status(201).json({
      message: "注册成功",
      user: { id: user.id, username: user.username, avatar: user.avatar },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "注册服务异常" });
  }
};

// 用户登录
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "用户名或密码错误" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "登录成功",
      token,
      user: { id: user.id, username: user.username, avatar: user.avatar },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "登录服务异常" });
  }
};
