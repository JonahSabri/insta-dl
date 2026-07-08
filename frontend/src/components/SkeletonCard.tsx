"use client";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      {/* Thumbnail skeleton */}
      <div className="skeleton-thumb">
        <div className="skeleton-shimmer" />
        {/* Play icon placeholder */}
        <div className="skeleton-play-btn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Text skeletons */}
      <div className="skeleton-body">
        {/* Badge */}
        <div className="skeleton-badge" />

        {/* Title lines */}
        <div className="skeleton-line skeleton-line-full" />
        <div className="skeleton-line skeleton-line-3/4" />

        {/* Meta row */}
        <div className="skeleton-meta">
          <div className="skeleton-dot" />
          <div className="skeleton-line skeleton-line-1/3" />
          <div className="skeleton-dot" />
          <div className="skeleton-line skeleton-line-1/4" />
        </div>

        {/* Button skeleton */}
        <div className="skeleton-btn" />
      </div>
    </div>
  );
}
