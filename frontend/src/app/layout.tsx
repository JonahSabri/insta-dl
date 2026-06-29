import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/i18n/context";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "InstaGet";

export const metadata: Metadata = {
  title: {
    default: `${siteName} — Instagram Downloader`,
    template: `%s | ${siteName}`,
  },
  description:
    "Free Instagram Reels, Posts, Images and Carousel downloader. Fast, no app needed.",
  keywords: ["Instagram downloader", "download reels", "دانلود اینستاگرام", "baixar instagram"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — Instagram Downloader`,
    description: "Free Instagram Reels, Posts, Images and Carousel downloader.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07081a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang/dir are overridden on client by LanguageProvider via useEffect
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-950" suppressHydrationWarning>
        {/* Animated background */}
        <div className="bg-stage" aria-hidden="true">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
          <div className="bg-grid" />
        </div>

        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
