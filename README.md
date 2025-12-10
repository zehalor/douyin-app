# Douyin Lite (全栈短视频平台)

Douyin Lite 是一个基于 **Client-Server 分离架构** 的全栈 Web 应用，旨在实现一个简易版的短视频社交平台。项目采用了现代化的 TypeScript 技术栈，前端使用 React 生态，后端使用 Node.js + Prisma。

## 项目亮点

- **全栈 TypeScript**: 前后端均使用 TypeScript 开发，提供完整的类型安全体验。

- **现代化架构**: 采用 React 18 + Vite 构建高性能前端，后端使用 Express + Prisma ORM。

- **瀑布流设计**: 首页采用 Masonry 瀑布流布局，完美适配不同尺寸的视频封面。

- **交互体验**: 精心设计的骨架屏 Loading 状态、点赞动画及视频详情弹窗。

- **资源管理**: 后端实现静态资源服务，支持视频与封面的上传与存储。

## 技术栈

### 前端 (Client)

- **核心框架**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)

- **语言**: TypeScript

- **UI 组件库**: [Ant Design](https://ant.design/) (ConfigProvider, Form, Modal, Table 等)

- **路由**: React Router DOM v6

- **网络请求**: Axios

- **布局**: `react-masonry-css` (瀑布流)

- **代码规范**: ESLint + Prettier

### 后端 (Server)

- **运行时**: Node.js

- **Web 框架**: [Express.js](https://expressjs.com/)

- **ORM**: [Prisma](https://www.prisma.io/)

- **数据库**: SQLite (开发环境)

- **认证**: JWT (JSON Web Token) + Bcryptjs

- **文件处理**: Multer

## 项目结构

```bash
douyin-app
├── client/                 # 前端项目 (React)
│   ├── src/
│   │   ├── components/     # 公共组件 (骨架屏、布局组件)
│   │   ├── pages/          # 页面视图 (首页、登录、管理、发布)
│   │   ├── assets/         # 静态资源
│   │   ├── App.tsx         # 根组件路由配置
│   │   └── main.tsx        # 入口文件
│   ├── package.json        # 前端依赖
│   └── vite.config.ts      # Vite 配置
│
├── server/                 # 后端项目 (Node.js)
│   ├── prisma/
│   │   ├── dev.db          # SQLite 数据库文件
│   │   └── schema.prisma   # 数据库模型定义
│   ├── src/
│   │   ├── controllers/    # 业务逻辑层
│   │   ├── routes/         # API 路由层
│   │   ├── utils/          # 工具函数 (上传配置等)
│   │   ├── middlewares/    # 中间件 (Auth)
│   │   └── index.ts        # 服务端入口
│   ├── uploads/            # 静态资源存储目录
│   └── package.json        # 后端依赖
│
└── README.md               # 项目文档
```

## 快速开始

### 1. 环境准备

确保本地环境已安装 [Node.js](https://nodejs.org/)。

### 2. 启动后端 (Server)

进入 `server` 目录并安装依赖：

```bash
cd server
npm install
```

初始化数据库 (Prisma + SQLite)：

```bash
# 执行数据库迁移
npx prisma migrate dev --name init
```

启动后端服务：

```bash
npm run dev
```

后端服务将运行在 `http://localhost:3000`。

### 3. 启动前端 (Client)

进入 `client` 目录并安装依赖：

```bash
cd client
npm install
```

启动开发服务器：

```bash
npm run dev
```

前端页面将运行在 `http://localhost:5173` (或其他 Vite 分配的端口)。

## 功能模块详情

### 用户认证

- **注册/登录**: 支持用户名密码注册，系统自动分配随机头像。

- **鉴权**: 使用 JWT Token 进行身份验证，保护私有路由。

- **修改密码**: 登录状态下支持修改用户密码。

### 视频浏览 (首页)

- **瀑布流**: 响应式布局展示视频卡片。

- **筛选排序**:
  - 关键词搜索 (标题/简介)

  - 排序维度：最新发布、最多播放、最多点赞、最早发布。

- **详情互动**: 点击卡片弹出模态框播放视频，支持查看作者信息、发布评论及点赞。

### 内容创作

- **发布作品**: 上传视频文件及封面图片。

- **自定义比例**: 支持设置封面比例 (3:4, 4:3, 1:1)，影响首页展示效果。

### 内容管理

- **管理后台**: 表格化展示当前用户发布的所有视频。

- **编辑/删除**: 支持修改视频元数据或级联删除视频及其关联的评论/点赞数据。

## 贡献与开发

项目配置了 `husky` 和 `lint-staged`，在提交代码时会自动执行 Prettier 格式化，确保代码风格统一。
