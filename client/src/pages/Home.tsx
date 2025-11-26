import { useEffect, useState } from "react";
import { Card, Typography, Avatar, message, Input, Select } from "antd";
import { UserOutlined, HeartOutlined } from "@ant-design/icons";
import axios from "axios";
import Masonry from "react-masonry-css";
import "./Home.css";
import SkeletonCard from "../components/SkeletonCard";

const { Meta } = Card;

const Home = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentKeyword, setCurrentKeyword] = useState("");

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const fetchVideos = async (keyword = "", sort = "newest") => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/videos", {
        params: { keyword, sort },
      });
      setVideos(res.data);
    } catch (error) {
      message.error("获取视频列表失败");
    } finally {
      // 稍微延迟一下，避免骨架屏闪烁
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      <Typography.Title
        level={3}
        style={{ marginBottom: 20, textAlign: "center" }}
      >
        🔥 热门推荐
      </Typography.Title>

      <div
        style={{
          maxWidth: 600,
          margin: "0 auto 30px auto",
          display: "flex",
          gap: 10,
        }}
      >
        <Input.Search
          placeholder="输入标题或简介搜索..."
          enterButton="搜索"
          size="large"
          onSearch={(value) => {
            setCurrentKeyword(value);
            fetchVideos(value, "newest");
          }}
          allowClear
          style={{ flex: 1 }}
        />

        <Select
          defaultValue="newest"
          size="large"
          style={{ width: 120 }}
          // 排序时需保留当前的搜索词
          onChange={(value) => fetchVideos(currentKeyword, value)}
          options={[
            { value: "newest", label: "最新发布" },
            { value: "oldest", label: "最早发布" },
          ]}
        />
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{ width: "30%", minWidth: "300px", flexGrow: 1 }}
            >
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {videos.map((item) => (
            <div key={item.id}>
              <Card
                className="video-card"
                hoverable
                cover={
                  <video
                    src={item.videoUrl}
                    controls
                    preload="metadata"
                    style={{
                      width: "100%",
                      display: "block",
                      backgroundColor: "#000",
                    }}
                  />
                }
                actions={[
                  <div key="like" style={{ color: "#666" }}>
                    <HeartOutlined /> {Math.floor(Math.random() * 1000)}
                  </div>,
                  <div key="user" style={{ fontSize: 12 }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>,
                ]}
              >
                <Meta
                  avatar={
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#f56a00" }}
                    />
                  }
                  title={item.title}
                  description={
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.description || "暂无简介"}
                    </div>
                  }
                />
              </Card>
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default Home;
