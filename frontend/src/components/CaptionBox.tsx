"use client";

import { useRef, useState } from "react";
import { fetchCaption } from "@/lib/api";

interface Props {
  placeholder?: string;
  ctaLabel?: string;
}

export default function CaptionBox({
  placeholder = "https://www.instagram.com/p/… or /reel/…",
  ctaLabel = "Fetch Caption",
}: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ uploader: string | null; media_type: string; title: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFetch() {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setCaption(null);
    setMeta(null);
    try {
      const res = await fetchCaption(trimmed);
      setCaption(res.caption || "");
      setMeta({ uploader: res.uploader, media_type: res.media_type, title: res.title });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not fetch caption");
    } finally {
      setLoading(false);
    }
  }

  async function copyText() {
    if (caption == null) return;
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy caption:", caption);
    }
  }

  function reset() {
    setUrl("");
    setCaption(null);
    setMeta(null);
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      {caption == null && (
        <div className="anim-scale-in">
          <div className="magic-border active">
            <div className="magic-border-inner p-1">
              <div className="flex items-stretch gap-0">
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                  placeholder={placeholder}
                  className="min-w-0 flex-1 rounded-r-[14px] bg-transparent px-4 py-3.5 text-sm text-white
                    placeholder-slate-600 outline-none"
                  dir="ltr"
                />
                <button
                  onClick={handleFetch}
                  disabled={!url.trim() || loading}
                  className="btn-primary m-1 shrink-0 rounded-[12px] px-5 py-2.5 text-sm disabled:transform-none"
                  type="button"
                >
                  {loading ? "…" : ctaLabel}
                </button>
              </div>
            </div>
          </div>
          {error && (
            <div
              className="anim-fade-in mt-3 flex items-start gap-2.5 rounded-2xl border border-red-500/20 px-4 py-3 text-sm text-red-400"
              style={{ background: "rgba(239,68,68,0.07)" }}
            >
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {caption != null && (
        <div className="anim-scale-in rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
          {meta && (
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              {meta.uploader && <span>{meta.uploader}</span>}
              <span className="uppercase tracking-wide text-slate-500">{meta.media_type}</span>
            </div>
          )}
          <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200 font-sans min-h-[120px]">
            {caption || "(no caption on this post)"}
          </pre>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary text-sm px-4 py-2" onClick={copyText} disabled={!caption}>
              {copied ? "Copied" : "Copy caption"}
            </button>
            <button type="button" className="btn-secondary text-sm px-4 py-2" onClick={reset}>
              Try another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
