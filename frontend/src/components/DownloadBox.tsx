"use client";

import { useState, useEffect, useRef } from "react";
import { analyzeUrl, pollStatus } from "@/lib/api";
import type { DownloadResult, DownloadStep, StatusResponse } from "@/types";
import { useT } from "@/i18n/context";
import SteppedProgress from "./SteppedProgress";
import PreviewCard from "./PreviewCard";

function isInstagramUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname.includes("instagram.com");
  } catch {
    return false;
  }
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function DownloadBox() {
  const t = useT();
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<DownloadStep>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  async function handleSubmit() {
    const trimmed = url.trim();
    if (!trimmed) return;

    if (!isInstagramUrl(trimmed)) {
      setError(t.download.errorInvalidUrl);
      return;
    }

    setStep("analyzing");
    setError(null);
    setProgress(10);

    try {
      const data = await analyzeUrl(trimmed);
      setProgress(20);
      setStep("processing");
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
          setResult({
            job_id: jobId,
            title: status.title ?? "Instagram Media",
            thumbnail_url: status.thumbnail_url ?? "",
            media_type: status.media_type ?? "unknown",
            file_count: status.file_count ?? 1,
            carousel_files: status.carousel_files ?? null,
          });
          setStep("ready");
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
    setResult(null); setError(null);
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  const isProcessing = step === "analyzing" || step === "processing";
  const isIdle = step === "idle" || step === "error";

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">

      {/* ── Input ── */}
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
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={t.download.placeholder}
                  className="min-w-0 flex-1 rounded-r-[14px] bg-transparent px-4 py-3.5 text-sm text-white
                    placeholder-slate-600 outline-none"
                  autoFocus
                  dir="ltr"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!url.trim()}
                  className="btn-primary m-1 shrink-0 rounded-[12px] px-5 py-2.5 text-sm disabled:transform-none"
                >
                  {isProcessing ? <Spinner /> : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                  {t.download.button}
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

      {isProcessing && (
        <SteppedProgress progress={progress} isAnalyzing={step === "analyzing"} />
      )}

      {step === "ready" && result && (
        <PreviewCard result={result} onReset={handleReset} />
      )}
    </div>
  );
}
