import { useEffect, useState } from "react";
import { Typography, Avatar, message, Input, Select, Modal } from "antd";
import { UserOutlined, HeartOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import Masonry from "react-masonry-css";
import SkeletonCard from "../components/SkeletonCard";
import VideoDetail from "./VideoDetail";
import "./Home.css";

const Home = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 筛选与排序状态
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [currentSort, setCurrentSort] = useState("newest"); // 默认按最新

  // 弹窗控制状态
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

  // 瀑布流断点配置
  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    900: 2,
    600: 2,
  };

  // 获取视频数据
  const fetchVideos = async (keyword = currentKeyword, sort = currentSort) => {
    // 只有在初始化或切换筛选条件时显示大 loading，关闭弹窗刷新时不显示
    if (!activeVideoId) setLoading(true);

    try {
      const res = await axios.get("http://localhost:3000/api/videos", {
        params: { keyword, sort },
      });
      setVideos(res.data);
    } catch (error) {
      message.error("获取内容失败");
    } finally {
      // 稍微延迟一点，让骨架屏不至于闪烁太快
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSearch = (value: string) => {
    setCurrentKeyword(value);
    fetchVideos(value, currentSort);
  };

  const handleSortChange = (value: string) => {
    setCurrentSort(value);
    fetchVideos(currentKeyword, value);
  };

  const handleCardClick = (id: number) => {
    setActiveVideoId(id);
  };

  const handleCloseModal = () => {
    setActiveVideoId(null);
    fetchVideos(currentKeyword, currentSort); // 静默刷新列表
  };

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
          maxWidth: 700,
          margin: "0 auto 30px auto",
          display: "flex",
          gap: 10,
        }}
      >
        {/* 搜索框 */}
        <Input.Search
          placeholder="搜索感兴趣的内容..."
          enterButton="搜索"
          size="large"
          onSearch={handleSearch}
          allowClear
          style={{ flex: 1 }}
        />

        {/* 排序下拉菜单 */}
        <Select
          defaultValue="newest"
          size="large"
          style={{ width: 140 }}
          onChange={handleSortChange}
          options={[
            { value: "newest", label: "最新发布" },
            { value: "views", label: "最多播放" },
            { value: "likes", label: "最多点赞" },
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
              onClick={() => handleCardClick(item.id)}
            >
              {/* 封面区 */}
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

              {/* 信息区 */}
              <div className="card-body">
                <div className="card-title">{item.title}</div>

                <div className="card-footer">
                  <div className="footer-user">
                    <Avatar
                      size={20}
                      src={item.author?.avatar}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#f56a00" }}
                    />
                    <span className="username">
                      {item.author?.username || "用户"}
                    </span>
                  </div>

                  {/* 数据展示：点赞 & 播放 */}
                  <div style={{ display: "flex", gap: 8, color: "#999" }}>
                    <div className="footer-like">
                      <EyeOutlined />
                      <span style={{ marginLeft: 2 }}>{item.views}</span>
                    </div>
                    <div className="footer-like">
                      <HeartOutlined />
                      <span style={{ marginLeft: 2 }}>
                        {item.likes?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      )}

      <Modal
        open={!!activeVideoId}
        onCancel={handleCloseModal}
        footer={null}
        width={1000}
        centered
        destroyOnClose
        closeIcon={null}
        styles={{
          content: {
            padding: 0,
            borderRadius: 12,
            overflow: "hidden",
            height: "85vh",
          },
          body: { padding: 0, height: "100%" },
        }}
      >
        {activeVideoId && (
          <VideoDetail videoId={activeVideoId} onClose={handleCloseModal} />
        )}
      </Modal>
    </div>
  );
};

export default Home;
