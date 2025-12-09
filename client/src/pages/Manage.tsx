import { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  Space,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import axios from "axios";

const Manage = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 编辑弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [form] = Form.useForm();

  // 获取当前登录用户
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 获取视频列表
  const fetchVideos = async (keyword = "") => {
    if (!user.id) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/videos", {
        params: {
          keyword,
          authorId: user.id,
        },
      });
      setVideos(res.data);
    } catch (error) {
      message.error("数据获取失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onSearch = (value: string) => {
    fetchVideos(value);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/videos/${id}`);
      message.success("删除成功");
      fetchVideos();
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleEditClick = (record: any) => {
    setCurrentVideo(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(
        `http://localhost:3000/api/videos/${currentVideo.id}`,
        values
      );
      message.success("修改成功");
      setIsModalOpen(false);
      fetchVideos();
    } catch (error) {
      message.error("修改失败");
    }
  };

  const columns = [
    {
      title: "封面",
      dataIndex: "videoUrl",
      key: "cover",
      width: 120,
      render: (_: string, record: any) => {
        const url = record.coverUrl || record.videoUrl;
        const isVideo = !record.coverUrl;
        return (
          <div
            style={{
              width: 100,
              height: 60,
              borderRadius: 6,
              overflow: "hidden",
              backgroundColor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isVideo ? (
              <video
                src={url}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <img
                src={url}
                alt="cover"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "基本信息",
      dataIndex: "title",
      key: "info",
      render: (_: any, record: any) => (
        <div style={{ maxWidth: 250 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
            {record.title}
          </div>
          <div
            style={{
              color: "#888",
              fontSize: 12,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {record.description || "暂无简介"}
          </div>
          <div style={{ marginTop: 6 }}>
            <Tag>ID: {record.id}</Tag>
            <Tag>{record.author?.username || "未知作者"}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "播放量",
      dataIndex: "views",
      key: "views",
      width: 100,
      align: "center" as const,
      sorter: (a: any, b: any) => a.views - b.views,
      render: (views: number) => (
        <span style={{ color: "#1677ff", fontWeight: 500 }}>
          <EyeOutlined style={{ marginRight: 4 }} />
          {views}
        </span>
      ),
    },
    {
      title: "点赞数",
      key: "likeCount",
      width: 100,
      align: "center" as const,
      sorter: (a: any, b: any) => a.likes.length - b.likes.length,
      render: (_: any, record: any) => (
        <span style={{ color: "#ff2442", fontWeight: 500 }}>
          <LikeOutlined style={{ marginRight: 4 }} />
          {record.likes.length}
        </span>
      ),
    },
    {
      title: "发布时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf(),
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "操作",
      key: "action",
      width: 160,
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            编辑
          </Button>

          <Popconfirm
            title="确定删除此视频？"
            description="删除后无法恢复"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          background: "#fff",
          padding: "16px 24px",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20 }}>📦 内容管理系统</h2>

        <Space>
          <Input.Search
            placeholder="搜索标题或简介..."
            onSearch={onSearch}
            style={{ width: 300 }}
            allowClear
            enterButton="搜索"
            size="middle"
          />
        </Space>
      </div>

      <Table
        dataSource={videos}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 8, showTotal: (total) => `共 ${total} 条数据` }}
        loading={loading}
        bordered
        style={{ background: "#fff", borderRadius: 8, padding: 24 }}
      />

      <Modal
        title="编辑视频信息"
        open={isModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="保存修改"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            label="视频标题"
            name="title"
            rules={[{ required: true, message: "标题不能为空" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item label="视频简介" name="description">
            <Input.TextArea rows={4} placeholder="请输入视频简介..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Manage;
