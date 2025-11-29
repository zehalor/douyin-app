import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Avatar,
  Typography,
  Button,
  List,
  Input,
  message,
  Spin,
  Divider,
} from "antd";
import {
  UserOutlined,
  LikeOutlined,
  LikeFilled,
  SendOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 互动状态
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  // 加载视频数据
  const fetchVideoDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/videos/${id}`);
      const data = res.data;

      setVideo(data);
      setLikeCount(data.likes.length);

      // 判断当前用户是否已点赞
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (currentUser.id) {
        const hasLiked = data.likes.some(
          (like: any) => like.userId === currentUser.id
        );
        setIsLiked(hasLiked);
      }
    } catch (error) {
      message.error("视频加载失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoDetail();
  }, [id]);

  // 点赞操作
  const handleToggleLike = async () => {
    if (!token) return message.warning("请登录后点赞");

    try {
      const res = await axios.post(
        `http://localhost:3000/api/videos/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { isLiked: newLikeStatus } = res.data;
      setIsLiked(newLikeStatus);
      setLikeCount((prev) => (newLikeStatus ? prev + 1 : prev - 1));
    } catch (error) {
      message.error("点赞失败");
    }
  };

  // 提交评论
  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;
    if (!token) return message.warning("请登录后评论");

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/videos/${id}/comments`,
        { content: commentContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("评论发布成功");
      setCommentContent("");

      // 乐观更新：直接把新评论加到列表头部，无需刷新
      setVideo((prev: any) => ({
        ...prev,
        comments: [res.data, ...prev.comments],
      }));
    } catch (error) {
      message.error("评论发布失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "100px" }}
      >
        <Spin size="large" tip="加载精彩内容..." />
      </div>
    );
  }

  if (!video)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        视频不存在或已被删除
      </div>
    );

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", gap: 24, flexDirection: "column" }}>
        {/* 播放器容器 */}
        <div
          style={{
            background: "#000",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <video
            src={video.videoUrl}
            controls
            autoPlay
            style={{ width: "100%", maxHeight: "70vh", display: "block" }}
          />
        </div>

        {/* 视频信息卡片 */}
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1 }}>
              <Title level={3} style={{ marginBottom: 16 }}>
                {video.title}
              </Title>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1677ff" }}
                />
                <div>
                  <Text strong style={{ fontSize: 16 }}>
                    {video.author.username}
                  </Text>
                  <div
                    style={{
                      color: "#8c8c8c",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <ClockCircleOutlined />{" "}
                    {new Date(video.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <Paragraph
                style={{ color: "#595959", fontSize: 15, lineHeight: 1.8 }}
              >
                {video.description || "暂无简介"}
              </Paragraph>
            </div>

            <Button
              type={isLiked ? "primary" : "default"}
              shape="round"
              size="large"
              icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
              onClick={handleToggleLike}
              style={{ minWidth: 100, marginLeft: 20 }}
            >
              {likeCount}
            </Button>
          </div>
        </Card>

        {/* 评论区 */}
        <Card
          title={`全部评论 (${video.comments.length})`}
          bordered={false}
          style={{ borderRadius: 12 }}
        >
          <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
            <Avatar icon={<UserOutlined />} />
            <div style={{ flex: 1 }}>
              <TextArea
                rows={2}
                placeholder="发一条友善的评论..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={isSubmitting}
                onClick={handleSubmitComment}
                style={{ float: "right" }}
              >
                发布评论
              </Button>
            </div>
          </div>

          <Divider />

          <List
            itemLayout="horizontal"
            dataSource={video.comments}
            renderItem={(item: any) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                    >
                      {item.user.username[0].toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text strong>{item.user.username}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(item.createdAt).toLocaleString()}
                      </Text>
                    </div>
                  }
                  description={
                    <Text style={{ color: "#262626", fontSize: 14 }}>
                      {item.content}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default VideoDetail;
