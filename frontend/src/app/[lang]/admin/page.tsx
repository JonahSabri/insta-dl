"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  adminLogin,
  fetchStats,
  fetchDownloads,
  fetchBanners,
  createBanner,
  toggleBanner,
  deleteBanner,
  fetchCredentials,
  saveCredentials,
  clearCredentials,
  fetchCookiesStatus,
  uploadCookies,
  deleteCookies,
  fetchProxy,
  saveProxy,
  fetchRateLimit,
  saveRateLimit,
  fetchAdminArticles,
  createArticle,
  updateArticle,
  toggleArticle,
  deleteArticle,
  uploadAdminImage,
} from "@/lib/api";
import type { AdminStats, DownloadRecord, Banner, AdminArticle } from "@/types";
import Link from "next/link";
import { LANGS } from "@/i18n/translations";
import RichTextEditor from "@/components/RichTextEditor";
import FlagIcon from "@/components/FlagIcon";
import { cn } from "@/lib/cn";

const ARTICLE_CATEGORIES = [
  { id: "guide", label: "Guide" },
  { id: "tips", label: "Tips" },
  { id: "tutorial", label: "Tutorial" },
  { id: "news", label: "News" },
  { id: "faq", label: "FAQ" },
  { id: "seo", label: "SEO" },
] as const;

// ─── Auth ─────────────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: (t: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = await adminLogin(username, password);
      localStorage.setItem("admin_token", token);
      onLogin(token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 bg-mesh-dark px-4">
      <div className="glass-card w-full max-w-sm p-8">
        <h1 className="mb-6 text-center text-xl font-bold text-white">Admin Panel</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="input-field"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input-field"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-slate-600 hover:text-slate-400">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────

function StatsCards({ stats }: { stats: AdminStats }) {
  const cards = [
    { label: "Total downloads", value: stats.total.toLocaleString("en"), icon: "📥", color: "text-brand-400" },
    { label: "Today", value: stats.today.toLocaleString("en"), icon: "📅", color: "text-cyan-400" },
    { label: "Completed", value: stats.completed.toLocaleString("en"), icon: "✅", color: "text-green-400" },
    { label: "Success rate", value: `${stats.success_rate}%`, icon: "📊", color: "text-purple-400" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="glass-card p-4">
          <p className="mb-1 text-xs text-slate-500">{c.label}</p>
          <div className="flex items-center gap-2">
            <span className="text-lg">{c.icon}</span>
            <span className={`text-xl font-bold ${c.color}`}>{c.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Downloads Table ──────────────────────────────────────────────────────────

function DownloadsTable({ token }: { token: string }) {
  const [items, setItems] = useState<DownloadRecord[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const data = await fetchDownloads(token, p);
        setItems(data.items);
        setPages(data.pages);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => { load(page); }, [load, page]);

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      completed: "bg-green-500/15 text-green-400",
      failed: "bg-red-500/15 text-red-400",
      processing: "bg-brand-500/15 text-brand-400",
      pending: "bg-slate-500/15 text-slate-400",
    };
    return map[s] ?? "bg-slate-500/15 text-slate-400";
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <h3 className="font-semibold text-slate-200">Recent downloads</h3>
        <button onClick={() => load(page)} className="text-xs text-slate-500 hover:text-slate-300">↻ Refresh</button>
      </div>
      {loading ? (
        <div className="p-8 text-center text-slate-600">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-right text-xs text-slate-600">
                  <th className="px-4 py-2">Job ID</th>
                  <th className="px-4 py-2">IP</th>
                  <th className="px-4 py-2">Browser / Device</th>
                  <th className="px-4 py-2">OS</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {items.map((d) => (
                  <tr key={d.job_id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{d.job_id.slice(0, 8)}…</td>
                    <td className="px-4 py-2 text-slate-400 font-mono text-xs">{d.ip_address}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-300">{d.browser ?? "—"}</span>
                        <span className="text-[10px] text-slate-600">{d.device ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-500">{d.os ?? "—"}</td>
                    <td className="px-4 py-2 text-slate-400">{d.media_type}</td>
                    <td className="px-4 py-2">
                      <span className={`badge ${statusBadge(d.status)}`}>{d.status}</span>
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-600">
                      {new Date(d.created_at).toLocaleString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div className="flex justify-center gap-2 p-3">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-7 w-7 rounded-lg text-xs ${page === i + 1 ? "bg-brand-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Banner Manager ───────────────────────────────────────────────────────────

function BannerManager({ token }: { token: string }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", position: "result", image_url: "", link_url: "", priority: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setBanners(await fetchBanners(token)); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createBanner(token, form as Omit<Banner, "id">);
      setShowForm(false);
      setForm({ name: "", position: "result", image_url: "", link_url: "", priority: 0 });
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error");
    }
  }

  async function handleToggle(id: string) {
    await toggleBanner(token, id);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    await deleteBanner(token, id);
    load();
  }

  const POSITIONS = ["header", "sidebar", "footer", "result"];

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <h3 className="font-semibold text-slate-200">Banner manager</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs py-1.5 px-3">
          {showForm ? "Close" : "+ New banner"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border-b border-white/5 p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input-field text-sm" placeholder="Banner name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <select className="input-field text-sm" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input className="input-field text-sm sm:col-span-2" placeholder="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} required />
            <input className="input-field text-sm sm:col-span-2" placeholder="Destination URL" value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} required />
            <input type="number" className="input-field text-sm" placeholder="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: Number(e.target.value) })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm py-2">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm py-2">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-600">Loading...</div>
      ) : banners.length === 0 ? (
        <div className="p-8 text-center text-slate-600">No banners yet.</div>
      ) : (
        <div className="divide-y divide-white/5">
          {banners.map((b: Banner & { name?: string; position?: string; is_active?: boolean; priority?: number }) => (
            <div key={b.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">{b.name}</p>
                <p className="text-xs text-slate-600">{b.position} · priority: {b.priority}</p>
              </div>
              <span className={`badge ${b.is_active ? "bg-green-500/15 text-green-400" : "bg-slate-500/15 text-slate-500"}`}>
                {b.is_active ? "Active" : "Inactive"}
              </span>
              <button onClick={() => handleToggle(b.id)} className="btn-secondary text-xs py-1 px-2">
                {b.is_active ? "Disable" : "Enable"}
              </button>
              <button onClick={() => handleDelete(b.id)} className="rounded-lg p-1.5 text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Proxy Manager ────────────────────────────────────────────────────────────

function ProxyManager({ token }: { token: string }) {
  const [proxy, setProxy] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetchProxy(token)
      .then((d) => setProxy(d.proxy))
      .catch(() => {});
  }, [token]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await saveProxy(token, proxy);
      setMsg({ type: "ok", text: proxy ? `Proxy saved ✓` : "Proxy disabled." });
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Error" });
    } finally {
      setSaving(false);
    }
  }

  const isActive = proxy.trim().length > 0;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-lg">
          🌐
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-200">Proxy</h3>
          <p className="text-xs text-slate-500">Bypass network restrictions</p>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
          isActive
            ? "border-green-500/30 bg-green-500/10 text-green-400"
            : "border-white/10 bg-white/5 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-400" : "bg-slate-600"}`} />
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-4 p-5">
        <div>
          <label className="mb-1.5 block text-xs text-slate-500">Proxy URL</label>
          <input
            type="text"
            value={proxy}
            onChange={(e) => { setProxy(e.target.value); setMsg(null); }}
            placeholder="http://127.0.0.1:10809"
            className="input-field font-mono text-sm"
            dir="ltr"
          />
        </div>

        {/* Examples */}
        <div className="space-y-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="mb-2 text-xs text-slate-600">Examples:</p>
          {[
            ["HTTP/HTTPS", "http://127.0.0.1:10809"],
            ["SOCKS5", "socks5://127.0.0.1:1080"],
            ["With auth", "http://user:pass@host:port"],
          ].map(([label, example]) => (
            <button
              key={label}
              type="button"
              onClick={() => { setProxy(example); setMsg(null); }}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/5"
            >
              <span className="w-20 shrink-0 text-xs text-slate-600">{label}</span>
              <code className="truncate text-xs text-slate-400">{example}</code>
            </button>
          ))}
        </div>

        {msg && (
          <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
            msg.type === "ok"
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}>
            {msg.type === "ok" ? "✓" : "✗"} {msg.text}
          </div>
        )}

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center text-sm disabled:opacity-50">
            {saving ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
              </svg>
            ) : "💾"}{" "}
            Save
          </button>
          {isActive && (
            <button
              type="button"
              onClick={() => { setProxy(""); setMsg(null); }}
              className="btn-secondary text-sm text-slate-400"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Cookies Manager ──────────────────────────────────────────────────────────

function CookiesManager({ token }: { token: string }) {
  const [status, setStatus] = useState<{ has_cookies: boolean; file_size: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try { setStatus(await fetchCookiesStatus(token)); } catch { /* ignore */ }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg(null);
    try {
      await uploadCookies(token, file);
      setMsg({ type: "ok", text: `Cookie file uploaded ✓ (${file.name})` });
      load();
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDelete() {
    if (!confirm("Delete cookie file?")) return;
    try {
      await deleteCookies(token);
      setMsg({ type: "ok", text: "Cookie file deleted." });
      load();
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Error" });
    }
  }

  const sizeKb = status ? Math.round(status.file_size / 1024) : 0;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-lg">
          🍪
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-200">Instagram cookie file</h3>
          <p className="text-xs text-slate-500">Most reliable authentication method</p>
        </div>
        {status?.has_cookies && (
          <span className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Active · {sizeKb} KB
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* How to get cookies - step by step */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-400">How to export cookies?</p>
          <ol className="space-y-2 text-xs text-slate-500">
            <li className="flex items-start gap-2">
              <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-[10px] font-bold text-brand-400">1</span>
              <span>Open Chrome or Firefox and sign in to <span className="text-slate-300">instagram.com</span>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-[10px] font-bold text-brand-400">2</span>
              <span>
                Install the{" "}
                <a href="https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300">
                  Get cookies.txt LOCALLY
                </a>{" "}
                extension.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-[10px] font-bold text-brand-400">3</span>
              <span>Click the extension icon and choose <span className="text-slate-300">Export</span> — download <span className="font-mono text-slate-300">instagram.com_cookies.txt</span>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-[10px] font-bold text-brand-400">4</span>
              <span>Upload that file here.</span>
            </li>
          </ol>
        </div>

        {/* Upload area */}
        <div
          onClick={() => fileRef.current?.click()}
          className="group relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-white/10 p-8 transition-colors hover:border-brand-500/40 hover:bg-brand-500/5"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".txt"
            onChange={handleFile}
            className="hidden"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl transition-transform group-hover:scale-110">
            {uploading ? (
              <svg className="h-6 w-6 animate-spin text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
              </svg>
            ) : "📂"}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-300">
              {uploading ? "Uploading..." : "Click or drop the file here"}
            </p>
            <p className="mt-0.5 text-xs text-slate-600">Netscape cookies.txt format</p>
          </div>
        </div>

        {/* Message */}
        {msg && (
          <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
            msg.type === "ok"
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}>
            {msg.type === "ok" ? "✓" : "✗"} {msg.text}
          </div>
        )}

        {/* Current cookies status */}
        {status?.has_cookies && (
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">✅</span>
              <div>
                <p className="text-sm font-medium text-slate-200">Cookies active</p>
                <p className="text-xs text-slate-600">Size: {sizeKb} KB</p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/20"
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Credentials Manager ─────────────────────────────────────────────────────

function CredentialsManager({ token }: { token: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showPass, setShowPass] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchCredentials(token);
      setUsername(data.instagram_username);
      setHasPassword(data.instagram_password_set);
    } catch {
      /* ignore */
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await saveCredentials(token, username, password);
      setMsg({ type: "ok", text: "Credentials saved ✓" });
      setPassword("");
      load();
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    if (!confirm("Clear Instagram credentials?")) return;
    try {
      await clearCredentials(token);
      setUsername("");
      setPassword("");
      setHasPassword(false);
      setMsg({ type: "ok", text: "Credentials cleared." });
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Error" });
    }
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-lg">
          🔑
        </div>
        <div>
          <h3 className="font-semibold text-slate-200">Instagram account</h3>
          <p className="text-xs text-slate-500">
            For private content or login walls
          </p>
        </div>
        {username && (
          <span className="mr-auto flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Connected: {username}
          </span>
        )}
      </div>

      {/* Info box */}
      <div className="mx-5 mt-4 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-xs text-amber-300"
        style={{ background: "rgba(245,158,11,0.07)" }}>
        <span className="mt-px text-base">⚠️</span>
        <div className="space-y-1">
          <p className="font-medium">Security tips:</p>
          <ul className="list-inside list-disc space-y-0.5 text-amber-300/80">
            <li>Use a secondary / throwaway Instagram account.</li>
            <li>Instagram may restrict accounts used for automated login.</li>
            <li>Password is stored without encryption in the database.</li>
          </ul>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-3 p-5">
        <div>
          <label className="mb-1.5 block text-xs text-slate-500">Instagram username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="input-field text-sm"
            dir="ltr"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-slate-500">
            Password
            {hasPassword && !password && (
              <span className="mr-2 text-green-400">● Saved password on file</span>
            )}
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={hasPassword ? "Enter a new password to change" : "Password"}
              className="input-field pr-10 text-sm"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPass ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Message */}
        {msg && (
          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
              msg.type === "ok"
                ? "border-green-500/20 bg-green-500/10 text-green-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            {msg.type === "ok" ? "✓" : "✗"} {msg.text}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={saving || (!username && !password)}
            className="btn-primary flex-1 justify-center text-sm disabled:opacity-50"
          >
            {saving ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
              </svg>
            ) : "💾"}{" "}
            Save credentials
          </button>
          {(username || hasPassword) && (
            <button
              type="button"
              onClick={handleClear}
              className="btn-secondary text-sm text-red-400 hover:border-red-500/30 hover:bg-red-500/10"
            >
              🗑 Clear
            </button>
          )}
        </div>
      </form>

      {/* How it works */}
    </div>
  );
}

// ─── Rate Limit Manager ───────────────────────────────────────────────────────

function RateLimitManager({ token }: { token: string }) {
  const [enabled, setEnabled] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(3);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetchRateLimit(token)
      .then((d) => { setEnabled(d.enabled); setDailyLimit(d.daily_limit); })
      .catch(() => {});
  }, [token]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await saveRateLimit(token, enabled, dailyLimit);
      setMsg({ type: "ok", text: "Settings saved ✓" });
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 text-lg">
          🚦
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-200">Daily download limit</h3>
          <p className="text-xs text-slate-500">Allowed downloads per IP per day</p>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
          enabled
            ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
            : "border-white/10 bg-white/5 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${enabled ? "bg-orange-400" : "bg-slate-600"}`} />
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-4 p-5">
        {/* Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-200">Enable rate limit</p>
            <p className="text-xs text-slate-500">When disabled, everyone can download without limits</p>
          </div>
          <button
            type="button"
            onClick={() => { setEnabled(!enabled); setMsg(null); }}
            className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-orange-500" : "bg-white/10"}`}
          >
            <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${enabled ? "left-6" : "left-1"}`} />
          </button>
        </div>

        {/* Daily limit */}
        <div>
          <label className="mb-1.5 block text-xs text-slate-500">
            Daily downloads allowed (per IP)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={1000}
              value={dailyLimit}
              onChange={(e) => { setDailyLimit(Number(e.target.value)); setMsg(null); }}
              className="input-field w-32 text-sm font-mono"
              dir="ltr"
              disabled={!enabled}
            />
            <span className="text-xs text-slate-500">downloads / day</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[1, 3, 5, 10, 20, 50].map((n) => (
              <button
                key={n}
                type="button"
                disabled={!enabled}
                onClick={() => { setDailyLimit(n); setMsg(null); }}
                className={`rounded-lg border px-3 py-1 text-xs transition-colors disabled:opacity-40 ${
                  dailyLimit === n
                    ? "border-brand-500/50 bg-brand-500/20 text-brand-300"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {msg && (
          <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
            msg.type === "ok"
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}>
            {msg.type === "ok" ? "✓" : "✗"} {msg.text}
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
          {saving ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
            </svg>
          ) : "💾"}{" "}
          Save settings
        </button>
      </form>
    </div>
  );
}

// ─── Article Manager ──────────────────────────────────────────────────────────

function ArticleManager({ token }: { token: string }) {
  const [items, setItems] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterLang, setFilterLang] = useState<string>("all");
  const [formLang, setFormLang] = useState("en");
  const [form, setForm] = useState({
    slug: "",
    category: "guide",
    cover_image: "",
    keywords: "",
    is_published: true,
    title: "",
    excerpt: "",
    content: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchAdminArticles(token));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const editorDir = (LANGS.find((l) => l.code === formLang)?.dir ?? "ltr") as "ltr" | "rtl";

  function resetForm() {
    setForm({
      slug: "",
      category: "guide",
      cover_image: "",
      keywords: "",
      is_published: true,
      title: "",
      excerpt: "",
      content: "",
    });
    setEditingId(null);
    setFormLang("en");
    setShowForm(false);
    setMsg(null);
  }

  function openCreate() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(a: AdminArticle) {
    const lang = a.translations.en ? "en" : Object.keys(a.translations)[0] || "en";
    const tr = a.translations[lang] || { title: "", excerpt: "", content: "" };
    setEditingId(a.id);
    setFormLang(lang);
    setForm({
      slug: a.slug,
      category: a.category || "guide",
      cover_image: a.cover_image || "",
      keywords: a.keywords,
      is_published: a.is_published,
      title: tr.title || "",
      excerpt: tr.excerpt || "",
      content: tr.content || "",
    });
    setShowForm(true);
    setMsg(null);
  }

  function switchLang(nextLang: string) {
    const current = editingId ? items.find((x) => x.id === editingId) : null;
    setFormLang(nextLang);
    if (current?.translations?.[nextLang]) {
      const tr = current.translations[nextLang];
      setForm((f) => ({
        ...f,
        title: tr.title || "",
        excerpt: tr.excerpt || "",
        content: tr.content || "",
      }));
    } else {
      setForm((f) => ({ ...f, title: "", excerpt: "", content: "" }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const plain = form.content.replace(/<[^>]+>/g, "").trim();
    if (!form.title.trim() || !plain) {
      setMsg({ type: "err", text: "Title and content are required." });
      return;
    }
    setSaving(true);
    setMsg(null);
    const payload = {
      slug: form.slug,
      category: form.category,
      cover_image: form.cover_image,
      keywords: form.keywords,
      is_published: form.is_published,
      lang: formLang,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
    };
    try {
      if (editingId) {
        await updateArticle(token, editingId, payload);
        setMsg({ type: "ok", text: "Article updated ✓" });
      } else {
        await createArticle(token, payload);
        setMsg({ type: "ok", text: "Article created ✓" });
      }
      await load();
      if (!editingId) resetForm();
      else {
        const refreshed = await fetchAdminArticles(token);
        setItems(refreshed);
        const updated = refreshed.find((x) => x.id === editingId);
        if (updated) openEdit(updated);
      }
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string) {
    await toggleArticle(token, id);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    await deleteArticle(token, id);
    if (editingId === id) resetForm();
    load();
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadAdminImage(token, file);
      setForm((f) => ({ ...f, cover_image: url }));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Cover upload failed");
    } finally {
      e.target.value = "";
    }
  }

  const catLabel = (id: string) =>
    ARTICLE_CATEGORIES.find((c) => c.id === id)?.label ?? id;

  const filteredItems = items.filter((a) => {
    if (filterLang === "all") return true;
    const tr = a.translations?.[filterLang];
    return Boolean(tr?.title?.trim());
  });

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
        <div>
          <h3 className="font-semibold text-slate-200">Blog / Articles</h3>
          <p className="text-xs text-slate-500">
            {filteredItems.length}/{items.length} articles · filter by language · rich editor
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="input-field text-xs py-1.5 w-auto"
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            title="Filter list by language"
          >
            <option value="all">All languages</option>
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>{l.label} ({l.code})</option>
            ))}
          </select>
          <button onClick={showForm && !editingId ? resetForm : openCreate} className="btn-primary text-xs py-1.5 px-3">
            {showForm && !editingId ? "Close" : "+ New article"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border-b border-white/5 p-4 space-y-4">
          <div>
            <p className="mb-1.5 text-xs text-slate-500">Writing language (each language is saved separately)</p>
            <div className="flex flex-wrap gap-1">
              {LANGS.map((l) => {
                const has = Boolean(editingId && items.find((x) => x.id === editingId)?.translations?.[l.code]?.title?.trim());
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => switchLang(l.code)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-colors",
                      formLang === l.code ? "bg-brand-600 text-white" : "bg-white/5 text-slate-400 hover:text-white"
                    )}
                  >
                    <FlagIcon lang={l.code} size={14} />
                    {l.code}
                    {has ? <span className="text-[10px] opacity-80">✓</span> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-500">Title</label>
              <input
                className="input-field text-sm"
                placeholder="Article title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Type / Section</label>
              <select
                className="input-field text-sm"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {ARTICLE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Slug</label>
              <input
                className="input-field text-sm font-mono"
                placeholder="how-to-download-reels"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                dir="ltr"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-500">Keywords (comma-separated)</label>
              <input
                className="input-field text-sm"
                placeholder="instagram reels, download, ..."
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-500">Cover image</label>
              <div className="flex flex-wrap gap-2">
                <input
                  className="input-field text-sm flex-1 font-mono"
                  placeholder="/api/v1/uploads/... or URL"
                  value={form.cover_image}
                  onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                  dir="ltr"
                />
                <label className="btn-secondary cursor-pointer text-xs py-2 px-3">
                  Upload cover
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                </label>
              </div>
              {form.cover_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.cover_image} alt="" className="mt-2 h-28 rounded-xl object-cover border border-white/10" />
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-500">Short excerpt</label>
              <textarea
                className="input-field text-sm min-h-[70px]"
                placeholder="Excerpt for cards and SEO"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-slate-500">Full content (rich editor)</label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                dir={editorDir}
                uploadImage={(file) => uploadAdminImage(token, file)}
                placeholder="Write the article with formatting…"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-400 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              />
              Published
            </label>
          </div>

          {msg && (
            <div className={`rounded-xl border px-4 py-2 text-sm ${
              msg.type === "ok"
                ? "border-green-500/20 bg-green-500/10 text-green-400"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}>
              {msg.text}
            </div>
          )}

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-50">
              {saving ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary text-sm py-2">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-600">Loading...</div>
      ) : filteredItems.length === 0 ? (
        <div className="p-8 text-center text-slate-600">
          {items.length === 0 ? "No articles yet." : "No articles for this language filter."}
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {filteredItems.map((a) => {
            const title =
              (filterLang !== "all" && a.translations[filterLang]?.title) ||
              a.translations.en?.title ||
              Object.values(a.translations)[0]?.title ||
              a.slug;
            const langs = Object.keys(a.translations).filter((k) => a.translations[k]?.title?.trim());
            return (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-slate-200">{title}</p>
                  <p className="text-xs text-slate-600 font-mono truncate">{a.slug}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600">
                    <span>{catLabel(a.category || "guide")}</span>
                    <span>·</span>
                    {langs.map((code) => (
                      <span key={code} className="inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5">
                        <FlagIcon lang={code} size={12} />
                        {code}
                      </span>
                    ))}
                  </p>
                </div>
                <span className={`badge ${a.is_published ? "bg-green-500/15 text-green-400" : "bg-slate-500/15 text-slate-500"}`}>
                  {a.is_published ? "Published" : "Draft"}
                </span>
                <button onClick={() => openEdit(a)} className="btn-secondary text-xs py-1 px-2">Edit</button>
                <button onClick={() => handleToggle(a.id)} className="btn-secondary text-xs py-1 px-2">
                  {a.is_published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  🗑
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [tab, setTab] = useState<"downloads" | "banners" | "articles" | "proxy" | "cookies" | "credentials" | "ratelimit">("downloads");

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (token) {
      fetchStats(token).then(setStats).catch(() => {
        localStorage.removeItem("admin_token");
        setToken(null);
      });
    }
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setToken(null);
    setStats(null);
  }

  if (!token) {
    return (
      <div dir="rtl" lang="en">
        <LoginForm onLogin={setToken} />
      </div>
    );
  }

  return (
    <div dir="rtl" lang="en" className="min-h-screen bg-slate-950 bg-mesh-dark">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-300">← Site</Link>
            <span className="text-slate-700">|</span>
            <span className="font-semibold text-white">Admin Panel</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-slate-600 hover:text-red-400 transition-colors">
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
        {/* Stats */}
        {stats && <StatsCards stats={stats} />}

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 rounded-xl bg-white/5 p-1 w-fit">
          {(["downloads", "articles", "banners", "ratelimit", "proxy", "cookies", "credentials"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t ? "bg-brand-600 text-white" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "downloads" ? "📥 Downloads"
                : t === "articles" ? "📝 Articles"
                : t === "banners" ? "🖼 Banners"
                : t === "ratelimit" ? "🚦 Rate limit"
                : t === "proxy" ? "🌐 Proxy"
                : t === "cookies" ? "🍪 Cookies"
                : "🔑 Credentials"}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "downloads" && <DownloadsTable token={token} />}
        {tab === "articles" && <ArticleManager token={token} />}
        {tab === "banners" && <BannerManager token={token} />}
        {tab === "ratelimit" && <RateLimitManager token={token} />}
        {tab === "proxy" && <ProxyManager token={token} />}
        {tab === "cookies" && <CookiesManager token={token} />}
        {tab === "credentials" && <CredentialsManager token={token} />}
      </main>
    </div>
  );
}
