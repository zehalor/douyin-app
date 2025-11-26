import { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Modal, Form, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const Manage = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchVideos = async () => {
    const res = await axios.get("http://localhost:3000/api/videos");
    setVideos(res.data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/videos/${id}`);
      message.success("删除成功");
      // 删完刷新一下列表
      fetchVideos();
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleEditClick = (record: any) => {
    setCurrentVideo(record);
    // 回填表单数据，注意字段名要跟后端对上
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
      fetchVideos(); // 改完直接重新拉取
    } catch (error) {
      message.error("修改失败");
    }
  };

  const columns = [
    {
      title: "封面",
      dataIndex: "videoUrl",
      key: "cover",
      render: (url: string) => (
        <video
          src={url}
          style={{
            width: 100,
            height: 60,
            objectFit: "cover",
            borderRadius: 4,
          }}
        />
      ),
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "简介",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            编辑
          </Button>

          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(record.id)}
            okText="删！"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 内容管理</h2>
      <Table
        dataSource={videos}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="编辑视频信息"
        open={isModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="保存修改"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "标题不能为空" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="简介" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Manage;
