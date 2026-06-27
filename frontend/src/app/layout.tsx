import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "InstaGet";

export const metadata: Metadata = {
  title: {
    default: `${siteName} — دانلود ریلز و پست اینستاگرام`,
    template: `%s | ${siteName}`,
  },
  description:
    "دانلود رایگان ریلز، پست، تصویر و کاروسل اینستاگرام. سریع، بدون نیاز به نصب برنامه.",
  keywords: ["دانلود اینستاگرام", "دانلود ریلز", "Instagram downloader"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — دانلود ریلز و پست اینستاگرام`,
    description: "دانلود رایگان ریلز، پست، تصویر و کاروسل اینستاگرام.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07081a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-950">
        {/* Animated background */}
        <div className="bg-stage" aria-hidden="true">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
          <div className="bg-grid" />
        </div>

        {children}
      </body>
    </html>
  );
}
