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
} from "@/lib/api";
import type { AdminStats, DownloadRecord, Banner } from "@/types";
import Link from "next/link";

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
      setError(err instanceof Error ? err.message : "خطا در ورود");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 bg-mesh-dark px-4">
      <div className="glass-card w-full max-w-sm p-8">
        <h1 className="mb-6 text-center text-xl font-bold text-white">پنل مدیریت</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="نام کاربری"
            className="input-field"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            className="input-field"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-slate-600 hover:text-slate-400">← بازگشت به سایت</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────

function StatsCards({ stats }: { stats: AdminStats }) {
  const cards = [
    { label: "کل دانلودها", value: stats.total.toLocaleString("fa"), icon: "📥", color: "text-brand-400" },
    { label: "امروز", value: stats.today.toLocaleString("fa"), icon: "📅", color: "text-cyan-400" },
    { label: "موفق", value: stats.completed.toLocaleString("fa"), icon: "✅", color: "text-green-400" },
    { label: "نرخ موفقیت", value: `٪${stats.success_rate}`, icon: "📊", color: "text-purple-400" },
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
        <h3 className="font-semibold text-slate-200">آخرین دانلودها</h3>
        <button onClick={() => load(page)} className="text-xs text-slate-500 hover:text-slate-300">↻ بروزرسانی</button>
      </div>
      {loading ? (
        <div className="p-8 text-center text-slate-600">در حال بارگذاری...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-right text-xs text-slate-600">
                  <th className="px-4 py-2">Job ID</th>
                  <th className="px-4 py-2">IP</th>
                  <th className="px-4 py-2">مرورگر / دستگاه</th>
                  <th className="px-4 py-2">سیستم‌عامل</th>
                  <th className="px-4 py-2">نوع</th>
                  <th className="px-4 py-2">وضعیت</th>
                  <th className="px-4 py-2">زمان</th>
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
                      {new Date(d.created_at).toLocaleString("fa-IR")}
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
      alert(err instanceof Error ? err.message : "خطا");
    }
  }

  async function handleToggle(id: string) {
    await toggleBanner(token, id);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف شود؟")) return;
    await deleteBanner(token, id);
    load();
  }

  const POSITIONS = ["header", "sidebar", "footer", "result"];

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <h3 className="font-semibold text-slate-200">مدیریت بنرها</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs py-1.5 px-3">
          {showForm ? "بستن" : "+ بنر جدید"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border-b border-white/5 p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input-field text-sm" placeholder="نام بنر" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <select className="input-field text-sm" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input className="input-field text-sm sm:col-span-2" placeholder="آدرس تصویر (URL)" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} required />
            <input className="input-field text-sm sm:col-span-2" placeholder="لینک مقصد (URL)" value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} required />
            <input type="number" className="input-field text-sm" placeholder="اولویت (عدد)" value={form.priority} onChange={e => setForm({ ...form, priority: Number(e.target.value) })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm py-2">ذخیره</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm py-2">انصراف</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="p-8 text-center text-slate-600">در حال بارگذاری...</div>
      ) : banners.length === 0 ? (
        <div className="p-8 text-center text-slate-600">هیچ بنری ثبت نشده.</div>
      ) : (
        <div className="divide-y divide-white/5">
          {banners.map((b: Banner & { name?: string; position?: string; is_active?: boolean; priority?: number }) => (
            <div key={b.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">{b.name}</p>
                <p className="text-xs text-slate-600">{b.position} · priority: {b.priority}</p>
              </div>
              <span className={`badge ${b.is_active ? "bg-green-500/15 text-green-400" : "bg-slate-500/15 text-slate-500"}`}>
                {b.is_active ? "فعال" : "غیرفعال"}
              </span>
              <button onClick={() => handleToggle(b.id)} className="btn-secondary text-xs py-1 px-2">
                {b.is_active ? "غیرفعال" : "فعال"}
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
      setMsg({ type: "ok", text: proxy ? `پراکسی ذخیره شد ✓` : "پراکسی غیرفعال شد." });
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "خطا" });
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
          <h3 className="font-semibold text-slate-200">پراکسی</h3>
          <p className="text-xs text-slate-500">برای عبور از محدودیت‌های شبکه</p>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
          isActive
            ? "border-green-500/30 bg-green-500/10 text-green-400"
            : "border-white/10 bg-white/5 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-400" : "bg-slate-600"}`} />
          {isActive ? "فعال" : "غیرفعال"}
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-4 p-5">
        <div>
          <label className="mb-1.5 block text-xs text-slate-500">آدرس پراکسی</label>
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
          <p className="mb-2 text-xs text-slate-600">نمونه فرمت‌ها:</p>
          {[
            ["HTTP/HTTPS", "http://127.0.0.1:10809"],
            ["SOCKS5", "socks5://127.0.0.1:1080"],
            ["با پسورد", "http://user:pass@host:port"],
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
            ذخیره
          </button>
          {isActive && (
            <button
              type="button"
              onClick={() => { setProxy(""); setMsg(null); }}
              className="btn-secondary text-sm text-slate-400"
            >
              پاک‌کردن
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
      setMsg({ type: "ok", text: `فایل کوکی آپلود شد ✓ (${file.name})` });
      load();
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "خطا در آپلود" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDelete() {
    if (!confirm("فایل کوکی حذف شود؟")) return;
    try {
      await deleteCookies(token);
      setMsg({ type: "ok", text: "فایل کوکی حذف شد." });
      load();
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "خطا" });
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
          <h3 className="font-semibold text-slate-200">فایل کوکی اینستاگرام</h3>
          <p className="text-xs text-slate-500">مطمئن‌ترین روش برای احراز هویت</p>
        </div>
        {status?.has_cookies && (
          <span className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            فعال · {sizeKb} KB
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* How to get cookies - step by step */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-400">چطور فایل کوکی بگیریم؟</p>
          <ol className="space-y-2 text-xs text-slate-500">
            <li className="flex items-start gap-2">
              <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-[10px] font-bold text-brand-400">۱</span>
              <span>مرورگر Chrome یا Firefox را باز کن و به <span className="text-slate-300">instagram.com</span> لاگین کن.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-[10px] font-bold text-brand-400">۲</span>
              <span>
                افزونه{" "}
                <a href="https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300">
                  Get cookies.txt LOCALLY
                </a>{" "}
                را نصب کن.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-[10px] font-bold text-brand-400">۳</span>
              <span>روی آیکون افزونه کلیک کن و گزینه <span className="text-slate-300">Export</span> را بزن — فایل <span className="font-mono text-slate-300">instagram.com_cookies.txt</span> دانلود می‌شه.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-600/30 text-[10px] font-bold text-brand-400">۴</span>
              <span>همان فایل را اینجا آپلود کن.</span>
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
              {uploading ? "در حال آپلود..." : "کلیک کن یا فایل را اینجا بکش"}
            </p>
            <p className="mt-0.5 text-xs text-slate-600">فرمت Netscape cookies.txt</p>
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
                <p className="text-sm font-medium text-slate-200">کوکی فعال</p>
                <p className="text-xs text-slate-600">اندازه: {sizeKb} KB</p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/20"
            >
              🗑 حذف
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
      setMsg({ type: "ok", text: "اطلاعات ورود ذخیره شد ✓" });
      setPassword("");
      load();
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "خطا در ذخیره‌سازی" });
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    if (!confirm("اطلاعات ورود اینستاگرام حذف شود؟")) return;
    try {
      await clearCredentials(token);
      setUsername("");
      setPassword("");
      setHasPassword(false);
      setMsg({ type: "ok", text: "اطلاعات پاک شد." });
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "خطا" });
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
          <h3 className="font-semibold text-slate-200">اکانت اینستاگرام</h3>
          <p className="text-xs text-slate-500">
            برای دانلود محتوای خصوصی یا عبور از محدودیت لاگین
          </p>
        </div>
        {username && (
          <span className="mr-auto flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            متصل: {username}
          </span>
        )}
      </div>

      {/* Info box */}
      <div className="mx-5 mt-4 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-xs text-amber-300"
        style={{ background: "rgba(245,158,11,0.07)" }}>
        <span className="mt-px text-base">⚠️</span>
        <div className="space-y-1">
          <p className="font-medium">توصیه‌های امنیتی:</p>
          <ul className="list-inside list-disc space-y-0.5 text-amber-300/80">
            <li>از یک حساب کاربری ثانویه یا دمی اینستاگرام استفاده کنید.</li>
            <li>اینستاگرام ممکن است حساب را به خاطر ورود خودکار محدود کند.</li>
            <li>رمز عبور به صورت رمزنگاری نشده در دیتابیس ذخیره می‌شود.</li>
          </ul>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-3 p-5">
        <div>
          <label className="mb-1.5 block text-xs text-slate-500">نام کاربری اینستاگرام</label>
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
            رمز عبور
            {hasPassword && !password && (
              <span className="mr-2 text-green-400">● رمز ذخیره شده موجود است</span>
            )}
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={hasPassword ? "برای تغییر، رمز جدید وارد کنید" : "رمز عبور"}
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
            ذخیره اطلاعات ورود
          </button>
          {(username || hasPassword) && (
            <button
              type="button"
              onClick={handleClear}
              className="btn-secondary text-sm text-red-400 hover:border-red-500/30 hover:bg-red-500/10"
            >
              🗑 پاک‌کردن
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
      setMsg({ type: "ok", text: "تنظیمات ذخیره شد ✓" });
    } catch (err: unknown) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "خطا" });
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
          <h3 className="font-semibold text-slate-200">محدودیت دانلود روزانه</h3>
          <p className="text-xs text-slate-500">تعداد دانلود مجاز هر IP در روز</p>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
          enabled
            ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
            : "border-white/10 bg-white/5 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${enabled ? "bg-orange-400" : "bg-slate-600"}`} />
          {enabled ? "فعال" : "غیرفعال"}
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-4 p-5">
        {/* Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-200">فعال‌بودن محدودیت</p>
            <p className="text-xs text-slate-500">در صورت غیرفعال‌بودن، همه می‌توانند بدون محدودیت دانلود کنند</p>
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
            تعداد دانلود مجاز در روز (به ازای هر IP)
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
            <span className="text-xs text-slate-500">دانلود در روز</span>
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
          ذخیره تنظیمات
        </button>
      </form>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [tab, setTab] = useState<"downloads" | "banners" | "proxy" | "cookies" | "credentials" | "ratelimit">("downloads");

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

  if (!token) return <LoginForm onLogin={setToken} />;

  return (
    <div className="min-h-screen bg-slate-950 bg-mesh-dark">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-300">← سایت</Link>
            <span className="text-slate-700">|</span>
            <span className="font-semibold text-white">پنل مدیریت</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-slate-600 hover:text-red-400 transition-colors">
            خروج
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
        {/* Stats */}
        {stats && <StatsCards stats={stats} />}

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 rounded-xl bg-white/5 p-1 w-fit">
          {(["downloads", "banners", "ratelimit", "proxy", "cookies", "credentials"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t ? "bg-brand-600 text-white" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "downloads" ? "📥 دانلودها"
                : t === "banners" ? "🖼 بنرها"
                : t === "ratelimit" ? "🚦 محدودیت"
                : t === "proxy" ? "🌐 پراکسی"
                : t === "cookies" ? "🍪 کوکی"
                : "🔑 یوزر/پسورد"}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "downloads" && <DownloadsTable token={token} />}
        {tab === "banners" && <BannerManager token={token} />}
        {tab === "ratelimit" && <RateLimitManager token={token} />}
        {tab === "proxy" && <ProxyManager token={token} />}
        {tab === "cookies" && <CookiesManager token={token} />}
        {tab === "credentials" && <CredentialsManager token={token} />}
      </main>
    </div>
  );
}
