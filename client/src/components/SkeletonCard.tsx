import "./Skeleton.css";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-video" />

      <div className="skeleton-info">
        <div className="skeleton-avatar" />
        <div className="skeleton-text" />
      </div>
    </div>
  );
};

export default SkeletonCard;
