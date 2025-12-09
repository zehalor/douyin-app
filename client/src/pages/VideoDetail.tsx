import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  List,
  Input,
  message,
  Spin,
  Divider,
  Typography,
} from "antd";
import {
  UserOutlined,
  HeartOutlined,
  HeartFilled,
  SendOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;

// 定义组件 Props
interface VideoDetailProps {
  videoId: number;
  onClose: () => void;
}

const VideoDetail = ({ videoId, onClose }: VideoDetailProps) => {
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 互动状态
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  // 初始化加载视频数据
  useEffect(() => {
    if (!videoId) return;

    const fetchVideoDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/videos/${videoId}`
        );
        const data = res.data;

        setVideo(data);
        setLikeCount(data.likes?.length || 0);
        setViewCount(data.views || 0); // 获取最新的播放量（后端已自增）

        // 判断当前用户是否已点赞
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (currentUser.id && data.likes) {
          const hasLiked = data.likes.some(
            (like: any) => like.userId === currentUser.id
          );
          setIsLiked(hasLiked);
        }
      } catch (error) {
        message.error("视频加载失败");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetail();
  }, [videoId]);

  // 点赞/取消点赞
  const handleToggleLike = async () => {
    if (!token) return message.warning("请先登录");

    try {
      const res = await axios.post(
        `http://localhost:3000/api/videos/${videoId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { isLiked: newLikeStatus } = res.data;
      setIsLiked(newLikeStatus);
      // 乐观更新点赞数
      setLikeCount((prev) => (newLikeStatus ? prev + 1 : prev - 1));
    } catch (error) {
      message.error("操作失败");
    }
  };

  // 提交评论
  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;
    if (!token) return message.warning("请先登录");

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/videos/${videoId}/comments`,
        { content: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("评论成功");
      setCommentContent("");

      // 将新评论插入到列表最前方
      setVideo((prev: any) => ({
        ...prev,
        comments: [res.data, ...prev.comments],
      }));
    } catch (error) {
      message.error("评论失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "600px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!video) return null;

  return (
    <div style={{ display: "flex", height: "85vh", backgroundColor: "#fff" }}>
      <div
        style={{
          flex: 1.6,
          backgroundColor: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* 关闭按钮*/}
        <Button
          type="text"
          icon={
            <CloseOutlined
              style={{ fontSize: 20, color: "rgba(255,255,255,0.8)" }}
            />
          }
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 10,
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "50%",
            width: 40,
            height: 40,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />

        {/* 视频播放器 */}
        <video
          src={video.videoUrl}
          controls
          autoPlay
          loop
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: 450,
          borderLeft: "1px solid #f0f0f0",
          position: "relative",
        }}
      >
        {/* 作者信息 */}
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar
              size={40}
              src={video.author.avatar}
              icon={<UserOutlined />}
              style={{ border: "1px solid #f0f0f0" }}
            />
            <span style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
              {video.author.username}
            </span>
          </div>
          <Button
            type="default"
            shape="round"
            size="small"
            style={{ color: "#ff2442", borderColor: "#ff2442" }}
          >
            关注
          </Button>
        </div>

        {/* 滚动内容区 (简介 + 评论) */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* 标题和简介 */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, marginBottom: 8, lineHeight: 1.4 }}>
              {video.title}
            </h2>
            <p
              style={{
                color: "#333",
                fontSize: 15,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {video.description}
            </p>
            <div style={{ color: "#999", fontSize: 12, marginTop: 12 }}>
              {new Date(video.createdAt).toLocaleString()}
            </div>
          </div>

          <Divider />

          {/* 评论列表 */}
          <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 14 }}>
            共 {video.comments.length} 条评论
          </div>

          <List
            itemLayout="horizontal"
            dataSource={video.comments}
            renderItem={(item: any) => (
              <List.Item
                style={{
                  border: "none",
                  padding: "12px 0",
                  alignItems: "flex-start",
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.user.avatar} size={32} />}
                  title={
                    <span style={{ color: "#666", fontSize: 13 }}>
                      {item.user.username}
                    </span>
                  }
                  description={
                    <div style={{ marginTop: 4 }}>
                      <span style={{ color: "#333", fontSize: 14 }}>
                        {item.content}
                      </span>
                      <div
                        style={{ fontSize: 11, color: "#ccc", marginTop: 4 }}
                      >
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>

        {/* 底部：固定操作栏 */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #f0f0f0",
            backgroundColor: "#fff",
          }}
        >
          {/* 数据栏：播放量 & 点赞 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
              gap: 24,
            }}
          >
            {/* 播放量展示 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#666",
              }}
            >
              <EyeOutlined style={{ fontSize: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{viewCount}</span>
            </div>

            {/* 点赞按钮 */}
            <div
              onClick={handleToggleLike}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {isLiked ? (
                <HeartFilled style={{ fontSize: 20, color: "#ff2442" }} />
              ) : (
                <HeartOutlined style={{ fontSize: 20, color: "#666" }} />
              )}
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: isLiked ? "#ff2442" : "#666",
                }}
              >
                {likeCount}
              </span>
            </div>
          </div>

          {/* 评论输入框 */}
          <div style={{ display: "flex", gap: 10 }}>
            <Input
              placeholder="说点什么，让大家看到你..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              onPressEnter={handleSubmitComment}
              maxLength={100}
              style={{
                borderRadius: 20,
                backgroundColor: "#f6f6f6",
                border: "none",
                padding: "8px 16px",
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              loading={isSubmitting}
              onClick={handleSubmitComment}
              disabled={!commentContent.trim()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
