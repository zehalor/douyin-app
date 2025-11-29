import { useEffect, useState } from "react";
import { Typography, Avatar, message, Input, Select } from "antd";
import { UserOutlined, HeartOutlined } from "@ant-design/icons";
import axios from "axios";
import Masonry from "react-masonry-css";
import { useNavigate } from "react-router-dom";
import SkeletonCard from "../components/SkeletonCard";
import "./Home.css";

const Home = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const navigate = useNavigate();

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    900: 2,
    600: 2,
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
        🔥 发现
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
          placeholder="搜索感兴趣的内容..."
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
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} style={{ width: "23%", minWidth: "200px" }}>
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
            <div
              key={item.id}
              className="xhs-card"
              onClick={() => navigate(`/video/${item.id}`)}
            >
              <div
                className="card-cover"
                style={{ aspectRatio: item.ratio || "3/4" }}
              >
                {item.coverUrl ? (
                  <img src={item.coverUrl} alt={item.title} />
                ) : (
                  <video src={item.videoUrl} preload="metadata" muted />
                )}
              </div>

              <div className="card-body">
                <div className="card-title">{item.title}</div>

                <div className="card-footer">
                  <div className="footer-user">
                    <Avatar
                      size={20}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#f56a00" }}
                    />
                    <span className="username">
                      {item.author?.username || "未知用户"}
                    </span>
                  </div>

                  <div className="footer-like">
                    <HeartOutlined />
                    <span>{item.likes?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default Home;
