import DownloadBox from "@/components/DownloadBox";
import Link from "next/link";

const FEATURES = [
  {
    icon: "⚡",
    title: "فوق‌سریع",
    desc: "دانلود مستقیم با بالاترین کیفیت موجود، بدون محدودیت سرعت.",
    delay: "anim-delay-100",
  },
  {
    icon: "📱",
    title: "همه فرمت‌ها",
    desc: "Reel، پست، تصویر، کاروسل — همه رو پشتیبانی می‌کنیم.",
    delay: "anim-delay-200",
  },
  {
    icon: "🔒",
    title: "حریم خصوصی",
    desc: "فایل‌ها روی سرور ذخیره نمی‌مانند. بعد از دانلود پاک می‌شوند.",
    delay: "anim-delay-300",
  },
  {
    icon: "🆓",
    title: "کاملاً رایگان",
    desc: "بدون نیاز به ثبت‌نام یا پرداخت برای دانلودهای روزانه.",
    delay: "anim-delay-400",
  },
];

const HOW_TO = [
  { step: "۱", label: "کپی لینک", desc: "لینک پست یا ریلز مورد نظر را از اینستاگرام کپی کن." },
  { step: "۲", label: "Paste کن", desc: "لینک را در کادر بالا جای‌گذاری کن و روی «دانلود» بزن." },
  { step: "۳", label: "دانلود!", desc: "چند ثانیه صبر کن، فایل آماده دانلود می‌شود." },
];

const SUPPORTED = [
  { icon: "🎬", label: "Reel" },
  { icon: "📸", label: "پست" },
  { icon: "🖼️", label: "تصویر" },
  { icon: "🎞️", label: "کاروسل" },
];

export default function Home() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "InstaGet";

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06]"
        style={{ background: "rgba(7,8,26,0.75)", backdropFilter: "blur(20px)" }}>
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="flex items-center gap-2.5 font-bold text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg text-sm"
              style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>
              ↓
            </span>
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {siteName}
            </span>
          </span>
          <Link href="/admin"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400
              backdrop-blur-sm transition-all hover:border-white/20 hover:text-white">
            پنل مدیریت
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative px-4 pb-16 pt-20 text-center">
          {/* Glow behind the box */}
          <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full
            opacity-20 blur-[90px]"
            style={{ background: "radial-gradient(circle,#7c3aed,transparent)" }} />

          <div className="relative mx-auto max-w-2xl">
            {/* Floating badge */}
            <div className="anim-fade-in mb-5 inline-flex items-center gap-2 rounded-full border border-brand-700/40
              bg-brand-900/30 px-4 py-1.5 text-xs font-medium text-brand-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              با چند کلیک ...
            </div>

            {/* Title */}
            <h1 className="anim-fade-up mb-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              دانلود{" "}
              <span style={{
                background: "linear-gradient(135deg,#a78bfa 0%,#7c3aed 40%,#06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                ریلز و پست
              </span>
              <br />
              اینستاگرام
            </h1>

            <p className="anim-fade-up anim-delay-100 mb-3 text-base text-slate-400 sm:text-lg">
              لینک هر محتوایی از اینستاگرام را بذار و فایل را با بالاترین کیفیت دانلود کن.
            </p>

            {/* Supported types */}
            <div className="anim-fade-up anim-delay-200 mb-10 flex flex-wrap justify-center gap-2">
              {SUPPORTED.map((s) => (
                <span key={s.label}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5
                    px-3 py-1 text-xs text-slate-400 backdrop-blur-sm">
                  {s.icon} {s.label}
                </span>
              ))}
            </div>

            {/* Download box */}
            <div className="anim-fade-up anim-delay-300">
              <DownloadBox />
            </div>
          </div>
        </section>

        {/* ── How to ── */}
        <section className="px-4 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="anim-fade-up mb-2 text-center text-xl font-bold text-white">
              در ۳ قدم ساده
            </h2>
            <p className="anim-fade-up anim-delay-100 mb-8 text-center text-sm text-slate-500">
              هیچ نصبی لازم نیست. مستقیم از مرورگر.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {HOW_TO.map((item, i) => (
                <div key={item.step}
                  className={`glow-card p-5 anim-fade-up`}
                  style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                    style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.25),rgba(6,182,212,0.15))",
                             border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}>
                    {item.step}
                  </div>
                  <h3 className="mb-1 font-semibold text-slate-100">{item.label}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="border-y border-white/[0.05] px-4 py-14"
          style={{ background: "rgba(255,255,255,0.015)" }}>
          <div className="mx-auto max-w-3xl">
            <h2 className="anim-fade-up mb-8 text-center text-xl font-bold text-white">
              چرا {siteName}؟
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div key={f.title}
                  className={`glass-card flex gap-4 p-5 anim-fade-up ${f.delay}`}>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                    style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-slate-100">{f.title}</h3>
                    <p className="text-sm text-slate-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="py-7 text-center text-xs text-slate-700">
        <span className="border-b border-white/5 pb-0.5">
          © {new Date().getFullYear()} {siteName}
        </span>
        {" — "} ساخته‌شده با  ❤️ - Jonah Sabri
      </footer>
    </div>
  );
}
