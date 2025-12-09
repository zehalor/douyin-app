import { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  message,
  Dropdown,
  Modal,
  Form,
  Input,
} from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  CloudUploadOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  UserOutlined,
  LockOutlined,
  DownOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Header, Content } = Layout;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 修改密码弹窗状态
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 获取用户信息用于展示
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 菜单点击导航
  const handleMenuClick = (e: any) => {
    if (e.key === "home") navigate("/");
    if (e.key === "publish") navigate("/publish");
    if (e.key === "manage") navigate("/manage");
  };

  // 退出登录逻辑
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    message.success("已退出登录");
    navigate("/login");
  };

  // 处理用户下拉菜单点击
  const handleUserMenuClick = (e: any) => {
    if (e.key === "logout") {
      handleLogout();
    } else if (e.key === "password") {
      setIsPasswordModalOpen(true);
    }
  };

  // 提交修改密码
  const handleChangePassword = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      setLoading(true);
      await axios.post(
        "http://localhost:3000/api/auth/change-password",
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success("密码修改成功，请重新登录");
      setIsPasswordModalOpen(false);
      form.resetFields();
      handleLogout(); // 修改成功后强制登出
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "修改失败";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 顶部导航高亮逻辑
  let selectedKey = "home";
  if (location.pathname.includes("publish")) selectedKey = "publish";
  if (location.pathname.includes("manage")) selectedKey = "manage";

  // 用户下拉菜单项
  const userMenuItems = [
    {
      key: "password",
      label: "修改密码",
      icon: <LockOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ display: "flex", alignItems: "center", padding: "0 24px" }}
      >
        <div
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            marginRight: 30,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Douyin Lite 🎵
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={[
            { key: "home", icon: <HomeOutlined />, label: "首页" },
            { key: "publish", icon: <CloudUploadOutlined />, label: "发视频" },
            { key: "manage", icon: <AppstoreOutlined />, label: "管理" },
          ]}
          style={{ flex: 1, minWidth: 0 }}
        />

        {/* 右侧用户菜单 */}
        <Dropdown
          menu={{ items: userMenuItems as any, onClick: handleUserMenuClick }}
        >
          <Button type="text" style={{ color: "white" }}>
            <UserOutlined />
            {user.username || "用户"}
            <DownOutlined style={{ fontSize: 12 }} />
          </Button>
        </Dropdown>
      </Header>

      <Content style={{ padding: "20px 50px", backgroundColor: "#f0f2f5" }}>
        <Outlet />
      </Content>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={isPasswordModalOpen}
        onOk={handleChangePassword}
        onCancel={() => {
          setIsPasswordModalOpen(false);
          form.resetFields();
        }}
        confirmLoading={loading}
        okText="确认修改"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="oldPassword"
            label="旧密码"
            rules={[{ required: true, message: "请输入旧密码" }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 6, message: "密码长度不能少于6位" },
            ]}
          >
            <Input.Password placeholder="设置一个新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "请确认新密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AppLayout;
