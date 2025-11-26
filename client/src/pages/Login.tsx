import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      // 直接透传表单数据
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        values
      );

      message.success(`登录成功！欢迎回来 ${res.data.user.username}`);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "登录失败，请检查网络";
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
      }}
    >
      <Card title="抖音后台管理系统" style={{ width: 400 }}>
        <Form name="login" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
