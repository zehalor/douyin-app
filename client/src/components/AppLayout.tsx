import { Layout, Menu, Button, message } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  CloudUploadOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 处理菜单点击
  const handleMenuClick = (e: any) => {
    if (e.key === "home") navigate("/");
    if (e.key === "publish") navigate("/publish");
    if (e.key === "manage") navigate("/manage");
  };

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    message.success("已退出登录");
    navigate("/login"); // 踢回登录页
  };

  // 根据当前的网址路径 (pathname) 来决定哪个菜单亮起
  let selectedKey = "home";
  if (location.pathname.includes("publish")) selectedKey = "publish";
  if (location.pathname.includes("manage")) selectedKey = "manage";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ display: "flex", alignItems: "center", padding: "0 20px" }}
      >
        <div
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            marginRight: 30,
          }}
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

        <Button
          type="text"
          style={{ color: "white" }}
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          退出
        </Button>
      </Header>

      <Content style={{ padding: "20px 50px", backgroundColor: "#f0f2f5" }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AppLayout;
