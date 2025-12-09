import { Form, Input, Button, Card, message, Typography } from "antd";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      // 发送注册请求
      await axios.post("http://localhost:3000/api/auth/register", {
        username: values.username,
        password: values.password,
      });

      message.success("注册成功！请登录");
      // 注册成功后自动跳到登录页
      navigate("/login");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "注册失败，请重试";
      message.error(errorMsg);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Title level={2}>Douyin Lite</Title>
        <div style={{ color: "#666" }}>全栈短视频创作平台</div>
      </div>

      <Card
        title="注册新账号"
        style={{
          width: 400,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input size="large" placeholder="给自己起个好听的名字" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: "请输入密码!" },
              { min: 6, message: "密码长度不能少于6位" },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="设置一个密码 (不少于6位)"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              立即注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            已有账号？ <Link to="/login">去登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
