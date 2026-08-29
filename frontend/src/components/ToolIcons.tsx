import type { DownloaderToolId } from "@/content/downloaders";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ToolIcon({
  id,
  className = "h-6 w-6",
}: {
  id: DownloaderToolId;
  className?: string;
}) {
  switch (id) {
    case "reel":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <rect x="2" y="4" width="14" height="16" rx="2.5" {...stroke} />
          <polygon points="18 8 22 12 18 16" fill="currentColor" stroke="none" />
          <circle cx="6.5" cy="8" r="1" fill="currentColor" stroke="none" />
          <circle cx="6.5" cy="16" r="1" fill="currentColor" stroke="none" />
          <path d="M9 9.5v5l4-2.5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "post":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="3" {...stroke} />
          <circle cx="8.5" cy="8.5" r="1.6" {...stroke} />
          <path d="M4.5 17.5l4.2-4.2a1.5 1.5 0 0 1 2.1 0L14 16.5l1.8-1.8a1.5 1.5 0 0 1 2.1 0l1.6 1.6" {...stroke} />
        </svg>
      );
    case "carousel":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <rect x="1.5" y="5" width="13" height="14" rx="2" {...stroke} />
          <path d="M16 7.5h2.5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H16" {...stroke} />
          <path d="M20.5 9.5h1a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-1" {...stroke} />
          <circle cx="5.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
          <path d="M3.5 15.5l2.8-2.5 2 1.8 2.5-3.2 2.7 3.9" {...stroke} />
        </svg>
      );
    case "story":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle cx="12" cy="12" r="4.2" {...stroke} />
          <path
            d="M12 2.5a9.5 9.5 0 0 1 8.2 4.7"
            {...stroke}
            strokeDasharray="2.2 2.4"
          />
          <path d="M21.2 10.2a9.5 9.5 0 0 1-1.2 8.1" {...stroke} strokeDasharray="2.2 2.4" />
          <path d="M17.2 20.3A9.5 9.5 0 0 1 6.8 20.3" {...stroke} strokeDasharray="2.2 2.4" />
          <path d="M3.9 18.1A9.5 9.5 0 0 1 2.8 10" {...stroke} strokeDasharray="2.2 2.4" />
          <path d="M4 6.8A9.5 9.5 0 0 1 12 2.5" {...stroke} />
        </svg>
      );
    case "highlight":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle cx="12" cy="12" r="8.5" {...stroke} />
          <path
            d="M12 6.2l1.35 3.55h3.65l-2.95 2.2 1.15 3.55L12 13.5l-3.2 2 1.15-3.55-2.95-2.2h3.65z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "bio":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <circle cx="12" cy="8" r="3.2" {...stroke} />
          <path d="M5.5 19.2c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" {...stroke} />
          <path d="M16.5 6.2h4M18.5 4.2v4" {...stroke} />
        </svg>
      );
    case "caption":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden>
          <path
            d="M5 4.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4.5 3v-3H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"
            {...stroke}
          />
          <path d="M7.5 9.5h9M7.5 13h6" {...stroke} />
        </svg>
      );
    default:
      return null;
  }
}

export const TOOL_ACCENT: Record<
  DownloaderToolId,
  { from: string; to: string; glow: string; soft: string }
> = {
  reel: { from: "#e1306c", to: "#fcb045", glow: "rgba(225,48,108,0.45)", soft: "rgba(225,48,108,0.12)" },
  post: { from: "#833ab4", to: "#c084fc", glow: "rgba(131,58,180,0.45)", soft: "rgba(131,58,180,0.12)" },
  carousel: { from: "#6366f1", to: "#a78bfa", glow: "rgba(99,102,241,0.45)", soft: "rgba(99,102,241,0.12)" },
  story: { from: "#f472b6", to: "#fb7185", glow: "rgba(244,114,182,0.45)", soft: "rgba(244,114,182,0.12)" },
  highlight: { from: "#f59e0b", to: "#fbbf24", glow: "rgba(245,158,11,0.4)", soft: "rgba(245,158,11,0.12)" },
  bio: { from: "#06b6d4", to: "#22d3ee", glow: "rgba(6,182,212,0.4)", soft: "rgba(6,182,212,0.12)" },
  caption: { from: "#10b981", to: "#34d399", glow: "rgba(16,185,129,0.4)", soft: "rgba(16,185,129,0.12)" },
};
