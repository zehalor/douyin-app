import { useState } from "react";
import { Form, Input, Button, Upload, message, Card, Radio } from "antd";
import { UploadOutlined, PictureOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Publish = () => {
  const [videoList, setVideoList] = useState<any[]>([]);
  const [coverList, setCoverList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const onFinish = async (values: any) => {
    if (!token) return message.error("请先登录");
    if (videoList.length === 0) return message.error("请选择视频文件！");

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("ratio", values.ratio);
    formData.append("video", videoList[0].originFileObj);

    if (coverList.length > 0) {
      formData.append("cover", coverList[0].originFileObj);
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:3000/api/videos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("发布成功！");
      navigate("/");
    } catch (error) {
      message.error("发布失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <Card title="发布作品" bordered={false} style={{ borderRadius: 12 }}>
        <Form
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ ratio: "3/4" }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input placeholder="写个吸引人的标题..." size="large" />
          </Form.Item>

          <Form.Item label="简介" name="description">
            <Input.TextArea rows={4} placeholder="分享你的故事..." />
          </Form.Item>

          {/* 封面尺寸选择器 */}
          <Form.Item
            label="封面尺寸"
            name="ratio"
            required
            tooltip="决定在首页展示时的长宽比"
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="3/4">3:4 (竖屏)</Radio.Button>
              <Radio.Button value="4/3">4:3 (横屏)</Radio.Button>
              <Radio.Button value="1/1">1:1 (正方)</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {/* 视频上传区域 */}
            <Form.Item
              label="视频文件 (必选)"
              required
              style={{ flex: 1, minWidth: 200 }}
            >
              <Upload
                beforeUpload={() => false}
                fileList={videoList}
                onChange={({ fileList }) => setVideoList(fileList)}
                maxCount={1}
                accept="video/*"
              >
                <Button icon={<UploadOutlined />} block style={{ height: 100 }}>
                  <div>点击上传视频</div>
                </Button>
              </Upload>
            </Form.Item>

            {/* 封面上传区域 */}
            <Form.Item
              label="封面图片 (可选)"
              style={{ flex: 1, minWidth: 200 }}
            >
              <Upload
                beforeUpload={() => false}
                fileList={coverList}
                onChange={({ fileList }) => setCoverList(fileList)}
                maxCount={1}
                listType="picture-card"
                accept="image/*"
              >
                {coverList.length < 1 && (
                  <div>
                    <PictureOutlined />
                    <div style={{ marginTop: 8 }}>上传封面</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isSubmitting}
            style={{ marginTop: 20 }}
          >
            发布
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
