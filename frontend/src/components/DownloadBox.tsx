"use client";

import { useState, useEffect, useRef } from "react";
import { previewUrl, analyzeUrl, pollStatus, getDownloadUrl } from "@/lib/api";
import type { DownloadResult, DownloadStep, MediaTypeFilter, PreviewData, StatusResponse } from "@/types";
import { useT } from "@/i18n/context";
import SkeletonCard from "./SkeletonCard";
import PreviewCard from "./PreviewCard";

/* ─── types ────────────────────────────────────────────────────────────────── */
export type ExtendedMediaTypeFilter = MediaTypeFilter | "carousel";

/* ─── helpers ──────────────────────────────────────────────────────────────── */

function isInstagramUrl(url: string): boolean {
  try {
    return new URL(url).hostname.includes("instagram.com");
  } catch {
    return false;
  }
}

function matchesType(url: string, type: ExtendedMediaTypeFilter): boolean {
  if (type === "all") return true;
  const path = url.toLowerCase();
  if (type === "reel")     return path.includes("/reel/");
  if (type === "post")     return path.includes("/p/");
  if (type === "carousel") return path.includes("/p/");
  if (type === "story")    return path.includes("/stories/");
  return true;
}

/* ─── SVG icon atoms ────────────────────────────────────────────────────────── */
const IcoReel = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const IcoPost = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);
const IcoCarousel = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="14" height="12" rx="2"/><path d="M18 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/>
  </svg>
);
const IcoStory = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
);
const IcoAll = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ─── Type selector ─────────────────────────────────────────────────────────── */

interface TypeOption {
  id: ExtendedMediaTypeFilter;
  icon: React.ReactNode;
  labelKey: string;
  placeholder: string;
}

const TYPE_OPTIONS: TypeOption[] = [
  { id: "reel",     icon: <IcoReel />,     labelKey: "reel",     placeholder: "https://www.instagram.com/reel/..." },
  { id: "post",     icon: <IcoPost />,     labelKey: "post",     placeholder: "https://www.instagram.com/p/..." },
  { id: "carousel", icon: <IcoCarousel />, labelKey: "carousel", placeholder: "https://www.instagram.com/p/..." },
  { id: "story",    icon: <IcoStory />,    labelKey: "story",    placeholder: "https://www.instagram.com/stories/..." },
  { id: "all",      icon: <IcoAll />,      labelKey: "all",      placeholder: "https://www.instagram.com/..." },
];

interface TypeSelectorProps {
  selected: ExtendedMediaTypeFilter;
  onChange: (t: ExtendedMediaTypeFilter) => void;
  labels: Record<string, string>;
}

function TypeSelector({ selected, onChange, labels }: TypeSelectorProps) {
  return (
    <div className="type-selector">
      {TYPE_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`type-pill ${selected === opt.id ? "active" : ""}`}
          type="button"
        >
          <span className="type-pill-icon">{opt.icon}</span>
          <span className="type-pill-label">{labels[opt.id] ?? opt.id}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Preview card (thumbnail shown before actual download) ─────────────────── */

interface PreviewStageCardProps {
  preview: PreviewData;
  onDownload: () => void;
  onReset: () => void;
  t: ReturnType<typeof useT>;
}

function PreviewStageCard({ preview, onDownload, onReset, t }: PreviewStageCardProps) {
  const mediaTypeLabel: Record<string, string> = {
    reel: t.download.typeLabels.reel,
    video: t.download.typeLabels.reel,
    post: t.download.typeLabels.post,
    image: t.download.typeLabels.post,
    carousel: t.download.typeLabels.post,
    story: t.download.typeLabels.story,
    unknown: "Media",
  };

  const label = mediaTypeLabel[preview.media_type] ?? "Media";

  return (
    <div className="preview-stage-card anim-scale-in">
      {/* Thumbnail */}
      <div className="preview-thumb-wrap">
        {preview.thumbnail_url ? (
          <img
            src={preview.thumbnail_url}
            alt={preview.title}
            className="preview-thumb-img"
            loading="lazy"
          />
        ) : (
          <div className="preview-thumb-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="opacity-30">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="preview-thumb-overlay" />

        {/* Type badge */}
        <span className="preview-type-badge">{label}</span>

        {/* Duration badge */}
        {preview.duration && (
          <span className="preview-duration-badge">
            {Math.floor(preview.duration / 60)}:{String(Math.round(preview.duration % 60)).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="preview-info">
        <p className="preview-uploader">{preview.uploader ?? "Instagram"}</p>
        <h3 className="preview-title" title={preview.title}>
          {preview.title.length > 80 ? preview.title.slice(0, 77) + "…" : preview.title}
        </h3>

        {/* CTA */}
        <div className="preview-actions">
          <button onClick={onDownload} className="btn-primary w-full flex items-center justify-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t.download.downloadNow}
          </button>
          <button onClick={onReset} className="btn-secondary w-full flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            {t.download.tryAnother}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Downloading progress overlay ─────────────────────────────────────────── */

interface DownloadingOverlayProps {
  progress: number;
  t: ReturnType<typeof useT>;
}

function DownloadingOverlay({ progress, t }: DownloadingOverlayProps) {
  const steps = [
    { label: t.steps.step1, done: progress >= 30,  icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
    { label: t.steps.step2, done: progress >= 60,  icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
    { label: t.steps.step3, done: progress >= 90,  icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> },
  ];

  return (
    <div className="downloading-overlay anim-fade-in">
      {/* Progress ring */}
      <div className="dl-ring-wrap">
        <svg className="dl-ring-svg" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="34" fill="none"
            stroke="url(#dlGrad)" strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
            transform="rotate(-90 40 40)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
          <defs>
            <linearGradient id="dlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="50%" stopColor="#e1306c" />
              <stop offset="100%" stopColor="#833ab4" />
            </linearGradient>
          </defs>
        </svg>
        <span className="dl-ring-pct">{progress}%</span>
      </div>

      {/* Steps */}
      <div className="dl-steps">
        {steps.map((s, i) => (
          <div key={i} className={`dl-step ${s.done ? "done" : i === steps.filter(x => x.done).length ? "active" : ""}`}>
            <span className="dl-step-icon">{s.icon}</span>
            <span className="dl-step-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */

interface Props {
  onResult?: (result: DownloadResult) => void;
}

export default function DownloadBox({ onResult }: Props) {
  const t = useT();

  const [mediaType, setMediaType] = useState<ExtendedMediaTypeFilter>("reel");
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<DownloadStep>("idle");
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const currentTypeOpt = TYPE_OPTIONS.find(o => o.id === mediaType) ?? TYPE_OPTIONS[4];
  const typeLabels = t.download.typeLabels;

  /* ── Phase 1: fetch preview ──────────────────────────────────────────────── */
  async function handleFetchPreview() {
    const trimmed = url.trim();
    if (!trimmed) return;

    if (!isInstagramUrl(trimmed)) {
      setError(t.download.errorInvalidUrl);
      return;
    }
    if (!matchesType(trimmed, mediaType)) {
      setError(t.download.errorTypeMismatch.replace("{type}", typeLabels[mediaType] ?? mediaType));
      return;
    }

    setStep("previewing");
    setError(null);

    try {
      const data = await previewUrl(trimmed);
      setPreviewData(data);
      setStep("preview_ready");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.download.errorServer);
      setStep("error");
    }
  }

  /* ── Phase 2: actual download ────────────────────────────────────────────── */
  async function handleStartDownload() {
    const trimmed = url.trim();
    if (!trimmed) return;

    setStep("downloading");
    setProgress(10);

    try {
      const data = await analyzeUrl(trimmed);
      setProgress(20);
      startPolling(data.job_id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.download.errorServer);
      setStep("error");
    }
  }

  function startPolling(jobId: string) {
    pollRef.current = setInterval(async () => {
      try {
        const status: StatusResponse = await pollStatus(jobId);
        setProgress(status.progress);

        if (status.status === "completed") {
          clearInterval(pollRef.current!);
          const res: DownloadResult = {
            job_id: jobId,
            title: status.title ?? "Instagram Media",
            thumbnail_url: status.thumbnail_url ?? previewData?.thumbnail_url ?? "",
            media_type: status.media_type ?? previewData?.media_type ?? "unknown",
            file_count: status.file_count ?? 1,
            carousel_files: status.carousel_files ?? null,
          };
          setResult(res);
          setStep("ready");
          onResult?.(res);

          // Auto-trigger browser download immediately
          const a = document.createElement("a");
          a.href = getDownloadUrl(jobId);
          a.download = "";
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          // Clean up after a tick so the click is processed
          setTimeout(() => document.body.removeChild(a), 500);
        } else if (status.status === "failed") {
          clearInterval(pollRef.current!);
          setError(status.error ?? t.download.errorServer);
          setStep("error");
        }
      } catch {
        clearInterval(pollRef.current!);
        setError(t.download.errorConnection);
        setStep("error");
      }
    }, 2000);
  }

  function handleReset() {
    if (pollRef.current) clearInterval(pollRef.current);
    setUrl(""); setStep("idle"); setProgress(0);
    setResult(null); setPreviewData(null); setError(null);
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  const isIdle = step === "idle" || step === "error";

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">

      {/* ─── Type Selector ───────────────────────────────────────────────────── */}
      {isIdle && (
        <div className="anim-fade-in">
          <TypeSelector
            selected={mediaType}
            onChange={(t) => { setMediaType(t); setError(null); }}
            labels={{
              reel:     typeLabels.reel,
              post:     typeLabels.post,
              carousel: typeLabels.carousel ?? "Carousel",
              story:    typeLabels.story,
              all:      typeLabels.all,
            }}
          />
        </div>
      )}

      {/* ─── URL Input ───────────────────────────────────────────────────────── */}
      {isIdle && (
        <div className="anim-scale-in">
          <div className={`magic-border ${focused || url ? "active" : ""}`}>
            <div className="magic-border-inner p-1">
              <div className="flex items-stretch gap-0">
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleFetchPreview()}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={currentTypeOpt.placeholder}
                  className="min-w-0 flex-1 rounded-r-[14px] bg-transparent px-4 py-3.5 text-sm text-white
                    placeholder-slate-600 outline-none"
                  dir="ltr"
                />
                <button
                  onClick={handleFetchPreview}
                  disabled={!url.trim()}
                  className="btn-primary m-1 shrink-0 rounded-[12px] px-5 py-2.5 text-sm disabled:transform-none"
                >
                  <svg className="mr-1.5 inline h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                  {t.download.fetchPreview}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="anim-fade-in mt-3 flex items-start gap-2.5 rounded-2xl border border-red-500/20
              bg-red-500/8 px-4 py-3 text-sm text-red-400"
              style={{ background: "rgba(239,68,68,0.07)" }}>
              <span className="mt-px shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <p className="mt-3 text-center text-xs text-slate-700">{t.download.tip}</p>
        </div>
      )}

      {/* ─── Phase 1: Skeleton (previewing) ──────────────────────────────────── */}
      {step === "previewing" && (
        <div className="anim-fade-in space-y-4">
          <p className="text-center text-sm text-slate-500 animate-pulse">{t.download.fetchingPreview}</p>
          <SkeletonCard />
        </div>
      )}

      {/* ─── Phase 1: Preview ready ───────────────────────────────────────────── */}
      {step === "preview_ready" && previewData && (
        <PreviewStageCard
          preview={previewData}
          onDownload={handleStartDownload}
          onReset={handleReset}
          t={t}
        />
      )}

      {/* ─── Phase 2: Downloading progress ───────────────────────────────────── */}
      {step === "downloading" && (
        <DownloadingOverlay progress={progress} t={t} />
      )}

      {/* ─── Phase 2: Complete ───────────────────────────────────────────────── */}
      {step === "ready" && result && (
        <PreviewCard result={result} onReset={handleReset} />
      )}
    </div>
  );
}
