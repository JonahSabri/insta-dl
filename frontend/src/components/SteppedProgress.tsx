"use client";

interface Props {
  progress: number;
  isAnalyzing?: boolean;
}

const STEPS = [
  { label: "دریافت لینک", icon: "🔗", desc: "تحلیل لینک" },
  { label: "پردازش فایل", icon: "⚙️", desc: "دانلود محتوا" },
  { label: "آماده دانلود", icon: "✅", desc: "تحویل فایل" },
];

export default function SteppedProgress({ progress, isAnalyzing }: Props) {
  const completed = progress >= 100;
  const activeStep = isAnalyzing ? 0 : progress < 60 ? 1 : completed ? 2 : 2;

  const messages = isAnalyzing
    ? "در حال تحلیل لینک..."
    : progress < 50
      ? "در حال دانلود فایل..."
      : progress < 90
        ? "در حال پردازش..."
        : completed
          ? "🎉 دانلود آماده شد!"
          : "در حال آماده‌سازی...";

  return (
    <div className="anim-scale-in glass-card overflow-hidden p-6">
      {/* Steps row */}
      <div className="mb-7 flex items-start justify-between">
        {STEPS.map((step, i) => {
          const done = completed ? true : i < activeStep;
          const active = i === activeStep && !completed;

          return (
            <div key={step.label} className="flex flex-1 items-start">
              {/* Step + label */}
              <div className="flex flex-col items-center gap-2">
                {/* Circle */}
                <div className="relative">
                  <div
                    className="relative flex h-11 w-11 items-center justify-center rounded-full text-base
                      transition-all duration-500"
                    style={
                      done
                        ? {
                            background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                            boxShadow: "0 0 20px rgba(124,58,237,0.6), 0 0 40px rgba(124,58,237,0.25)",
                          }
                        : active
                          ? {
                              background: "rgba(124,58,237,0.15)",
                              border: "1.5px solid rgba(124,58,237,0.6)",
                              boxShadow: "0 0 16px rgba(124,58,237,0.35)",
                            }
                          : {
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }
                    }
                  >
                    {done ? (
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className={active ? "text-brand-300" : "text-slate-600"}>
                        {step.icon}
                      </span>
                    )}
                  </div>

                  {/* Spinning ring for active step */}
                  {active && (
                    <div className="absolute inset-0 rounded-full"
                      style={{
                        border: "2px solid transparent",
                        borderTopColor: "#a78bfa",
                        borderRightColor: "#06b6d4",
                        animation: "spin-slow 1.2s linear infinite",
                      }} />
                  )}
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className={`whitespace-nowrap text-xs font-medium transition-colors duration-300
                    ${done || active ? "text-slate-200" : "text-slate-700"}`}>
                    {step.label}
                  </p>
                  <p className={`text-[10px] transition-colors ${active ? "text-brand-400" : "text-slate-700"}`}>
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="relative mx-3 mb-9 mt-5 h-px flex-1 overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-white/5" />
                  {done && (
                    <div className="absolute inset-0 rounded-full"
                      style={{ background: "linear-gradient(90deg,#7c3aed,#6d28d9)",
                               boxShadow: "0 0 6px rgba(124,58,237,0.5)" }} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="relative mb-3 h-2.5 overflow-hidden rounded-full bg-white/5">
        {/* Track glow */}
        <div className="absolute inset-0 rounded-full opacity-30 blur-sm"
          style={{ background: "linear-gradient(90deg,#7c3aed,#a855f7,#06b6d4)" }} />
        {/* Fill */}
        <div
          className="relative h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.max(5, progress)}%`,
            background: "linear-gradient(90deg,#7c3aed 0%,#a855f7 50%,#06b6d4 100%)",
            boxShadow: "0 0 12px rgba(124,58,237,0.7)",
          }}
        />
        {/* Shimmer on bar */}
        {!completed && (
          <div className="absolute inset-0 overflow-hidden rounded-full"
            style={{ width: `${Math.max(5, progress)}%` }}>
            <div className="absolute inset-y-0 w-20 -skew-x-12 bg-white/20"
              style={{ animation: "shimmer 1.8s ease-in-out infinite" }} />
          </div>
        )}
      </div>

      {/* Percentage + message */}
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium transition-colors
          ${completed ? "text-green-400" : "text-slate-400"}`}>
          {messages}
        </p>
        <span className="text-xs tabular-nums text-slate-600">
          {Math.min(100, Math.round(progress))}٪
        </span>
      </div>
    </div>
  );
}
