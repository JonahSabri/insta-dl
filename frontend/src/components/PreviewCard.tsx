"use client";

import { useState } from "react";
import { getDownloadUrl } from "@/lib/api";
import { useT } from "@/i18n/context";
import type { CarouselFile, DownloadResult } from "@/types";

function DownloadIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function ZipIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  );
}

function SlideRow({ file, index, imageLabel, videoLabel }: {
  file: CarouselFile;
  index: number;
  imageLabel: string;
  videoLabel: string;
  slideLabel: string;
}) {
  const isVideo = file.media_type === "video";
  return (
    <a
      href={file.url}
      download={file.name}
      className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02]
        px-3 py-2.5 transition-all hover:border-brand-500/30 hover:bg-brand-500/5"
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
        style={{ background: isVideo ? "rgba(168,85,247,0.15)" : "rgba(6,182,212,0.12)" }}
      >
        {isVideo
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      }
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-slate-300">
          {isVideo ? videoLabel : imageLabel} {index + 1}
        </p>
        <p className="truncate text-[10px] text-slate-600">{isVideo ? videoLabel : imageLabel}</p>
      </div>
      <svg
        className="h-4 w-4 shrink-0 text-slate-600 transition-colors group-hover:text-brand-400"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </a>
  );
}

interface Props {
  result: DownloadResult;
  onReset: () => void;
}

export default function PreviewCard({ result, onReset }: Props) {
  const t = useT();
  const { preview } = t;

  const [copied, setCopied] = useState(false);
  const [showSlides, setShowSlides] = useState(false);

  const downloadUrl = getDownloadUrl(result.job_id);
  const meta = preview.types[result.media_type] ?? preview.types.unknown;
  const isCarousel = result.media_type === "carousel" && result.file_count > 1;
  const isImage = result.media_type === "image" || result.media_type === "post";
  const slides = result.carousel_files ?? [];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  const downloadLabel = isCarousel
    ? preview.downloadZip(result.file_count)
    : isImage
      ? preview.downloadImage
      : preview.downloadVideo;

  return (
    <div className="anim-bounce-in result-card overflow-hidden">

      {/* ── Thumbnail + info ── */}
      <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5">
        <div className="relative h-44 w-full sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-800/80">
          {result.thumbnail_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.thumbnail_url}
                alt={result.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 65%)" }} />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </div>
          )}

            <span className="absolute bottom-1.5 right-1.5 rounded-md px-1.5 py-0.5
            text-[10px] font-semibold text-white backdrop-blur-md"
            style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}>
            {meta.label}
          </span>

          {isCarousel && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
              style={{ background: "rgba(0,0,0,0.45)" }}>
              <div className="flex flex-col items-center gap-1">
                <svg className="h-6 w-6 text-white/80" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={1.5}>
                  <rect x="2" y="6" width="14" height="14" rx="2" />
                  <path strokeLinecap="round" d="M6 2h14a2 2 0 012 2v14" />
                </svg>
                <span className="text-sm font-bold text-white">{result.file_count}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>
            <span className="text-xs font-medium text-green-400">{preview.readyToDownload}</span>
          </div>

          <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-100">
            {result.title || "Instagram Media"}
          </p>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="badge rounded-lg px-2.5 py-1 text-xs font-medium"
              style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}35`, color: meta.color }}>
              {meta.label}
            </span>
            {isCarousel && (
              <span className="badge flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M18 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/></svg>
                {result.file_count} files
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Carousel actions ── */}
      {isCarousel && (
        <div className="mx-4 mb-3 space-y-2">
          <div className="flex gap-2">
            <a href={downloadUrl} download
              className="btn-primary flex flex-1 items-center justify-center gap-2 text-sm">
              <ZipIcon />
              {downloadLabel}
            </a>
            {slides.length > 0 && (
              <button
                onClick={() => setShowSlides(!showSlides)}
                className="btn-secondary flex items-center gap-1.5 text-sm"
              >
                <svg className={`h-4 w-4 transition-transform ${showSlides ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {preview.downloadIndividual}
              </button>
            )}
          </div>

          {showSlides && slides.length > 0 && (
            <div className="space-y-1.5 rounded-2xl border border-white/[0.07] bg-black/20 p-3">
              <p className="mb-2 px-1 text-xs text-slate-500">{preview.downloadIndividual}:</p>
              {slides.map((file, i) => (
                <SlideRow
                  key={file.index}
                  file={file}
                  index={i}
                  imageLabel={preview.image}
                  videoLabel={preview.video}
                  slideLabel={preview.slideLabel(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Non-carousel actions ── */}
      {!isCarousel && (
        <>
          <div className="mx-5 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="flex gap-2.5 p-4">
            <a href={downloadUrl} download className="btn-primary flex-1 gap-2 text-sm">
              <DownloadIcon />
              {downloadLabel}
            </a>
            <button onClick={handleCopy} className="btn-secondary gap-2 text-sm" title={preview.copyLink}>
              {copied ? (
                <>
                  <svg className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400">{preview.copied}</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  {preview.copyLink}
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* ── Another link ── */}
      <button
        onClick={onReset}
        className="w-full border-t border-white/[0.05] px-4 py-3 text-sm text-slate-600
          transition-colors hover:text-slate-300"
      >
        {preview.anotherLink}
      </button>
    </div>
  );
}
