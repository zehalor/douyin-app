douyin-app
├── client/ # 前端项目 (React)
│ ├── src/
│ │ ├── components/ # 公共组件 (如骨架屏、布局组件)
│ │ ├── pages/ # 页面视图 (首页、登录、管理、发布)
│ │ ├── assets/ # 静态资源
│ │ ├── App.tsx # 根组件 (路由配置)
│ │ └── main.tsx # 入口文件
│ ├── package.json # 前端依赖配置
│ └── vite.config.ts # Vite 构建配置
│
├── server/ # 后端项目 (Node.js)
│ ├── prisma/
│ │ ├── dev.db # SQLite 数据库文件
│ │ └── schema.prisma # 数据库模型定义
│ ├── src/
│ │ ├── controllers/ # 业务逻辑层 (处理具体请求)
│ │ ├── routes/ # 路由层 (API 接口定义)
│ │ ├── utils/ # 工具函数 (如文件上传配置)
│ │ └── index.ts # 后端入口文件
│ ├── uploads/ # 视频文件存储目录
│ └── package.json # 后端依赖配置
│
└── README.md # 项目说明文档
