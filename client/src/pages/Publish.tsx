import { useState } from "react";
import { Form, Input, Button, Upload, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const Publish = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);

    if (fileList.length === 0) {
      message.error("请选择一个视频文件！");
      return;
    }

    formData.append("video", fileList[0].originFileObj);

    try {
      await axios.post("http://localhost:3000/api/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("发布成功");
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("发布失败");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 50, maxWidth: 600, margin: "0 auto" }}>
      <Card title="发布新视频">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input placeholder="给视频起个标题" />
          </Form.Item>

          <Form.Item label="简介" name="description">
            <Input.TextArea rows={4} placeholder="说点什么..." />
          </Form.Item>

          <Form.Item label="视频文件" required>
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1} // 限制只能传1个
            >
              <Button icon={<UploadOutlined />}>点击选择视频</Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">
            立即发布
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
