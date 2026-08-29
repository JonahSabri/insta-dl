"use client";

import { useRef, useState } from "react";
import { ApiError, fetchBio } from "@/lib/api";
import { useLang } from "@/i18n/context";
import { localizeErrorCode } from "@/i18n/errors";

interface BioData {
  username: string;
  full_name: string;
  biography: string;
  followers: number | null;
  following: number | null;
  posts: number | null;
  profile_pic_url: string | null;
  is_verified: boolean;
  external_url: string;
}

interface Props {
  placeholder?: string;
  ctaLabel?: string;
}

export default function BioBox({
  placeholder = "username (without @)",
  ctaLabel = "Fetch Bio",
}: Props) {
  const { lang } = useLang();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BioData | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFetch() {
    const clean = username.trim().replace(/^@/, "");
    if (!clean) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetchBio(clean);
      setData(res);
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "GENERIC";
      setError(localizeErrorCode(code, lang));
    } finally {
      setLoading(false);
    }
  }

  async function copyBio() {
    if (!data?.biography) return;
    try {
      await navigator.clipboard.writeText(data.biography);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy bio:", data.biography);
    }
  }

  function reset() {
    setUsername("");
    setData(null);
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      {!data && (
        <div className="anim-scale-in">
          <div className="magic-border active">
            <div className="magic-border-inner p-1">
              <div className="flex items-stretch gap-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                  placeholder={placeholder}
                  className="min-w-0 flex-1 rounded-r-[14px] bg-transparent px-4 py-3.5 text-sm text-white
                    placeholder-slate-600 outline-none"
                  dir="ltr"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={handleFetch}
                  disabled={!username.trim() || loading}
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
          <p className="mt-3 text-center text-xs text-slate-700">
            Public usernames only · no password required
          </p>
        </div>
      )}

      {data && (
        <div className="anim-scale-in rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
          <div className="flex items-center gap-4">
            {data.profile_pic_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/v1/download/thumbnail-proxy?url=${encodeURIComponent(data.profile_pic_url)}`}
                alt={`${data.username} avatar`}
                className="h-16 w-16 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-white/10" />
            )}
            <div className="min-w-0">
              <p className="text-lg font-semibold text-white truncate">
                @{data.username}
                {data.is_verified ? " ✓" : ""}
              </p>
              {data.full_name ? (
                <p className="text-sm text-slate-400 truncate">{data.full_name}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            {data.followers != null && <span>{data.followers.toLocaleString()} followers</span>}
            {data.following != null && <span>{data.following.toLocaleString()} following</span>}
            {data.posts != null && <span>{data.posts.toLocaleString()} posts</span>}
          </div>

          <div>
            <label className="mb-1 block text-[11px] text-slate-500">Biography</label>
            <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200 font-sans">
              {data.biography || "(empty bio)"}
            </pre>
          </div>

          {data.external_url ? (
            <p className="text-xs text-slate-500 break-all">Link: {data.external_url}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary text-sm px-4 py-2" onClick={copyBio} disabled={!data.biography}>
              {copied ? "Copied" : "Copy bio"}
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
