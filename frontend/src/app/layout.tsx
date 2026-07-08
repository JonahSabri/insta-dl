import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/i18n/context";
import PwaRegister from "@/components/PwaRegister";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";
const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL  ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default:  `${siteName} — Instagram Downloader`,
    template: `%s | ${siteName}`,
  },
  description:
    "Free Instagram Reels, Posts, Images and Carousel downloader. Fast, no sign-up needed.",
  keywords: [
    "Instagram downloader",
    "download reels",
    "download instagram video",
    "دانلود اینستاگرام",
    "baixar instagram",
    "JazzGhost",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type:        "website",
    siteName,
    title:       `${siteName} — Instagram Downloader`,
    description: "Free Instagram Reels, Posts, Images and Carousel downloader.",
    url:         siteUrl,
  },
  twitter: {
    card:        "summary",
    title:       `${siteName} — Instagram Downloader`,
    description: "Free Instagram Reels, Posts & Carousel downloader.",
  },
  robots: { index: true, follow: true },

  /* PWA / Apple */
  appleWebApp: {
    capable:    true,
    title:      siteName,
    statusBarStyle: "black-translucent",
  },

  /* manifest is auto-linked by Next.js from app/manifest.ts */
};

export const viewport: Viewport = {
  themeColor:   [
    { media: "(prefers-color-scheme: dark)",  color: "#833ab4" },
    { media: "(prefers-color-scheme: light)", color: "#833ab4" },
  ],
  colorScheme:    "dark",
  width:          "device-width",
  initialScale:   1,
  maximumScale:   5,     /* allow user zoom — accessibility */
  viewportFit:    "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* PWA — Apple-specific meta */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={siteName} />

        {/* Splash-screen color for Android Chrome */}
        <meta name="msapplication-TileColor" content="#833ab4" />
        <meta name="msapplication-config" content="none" />

        {/* Disable phone-number auto-detection */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-screen bg-slate-950" suppressHydrationWarning>
        {/* Animated background */}
        <div className="bg-stage" aria-hidden="true">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
          <div className="bg-orb bg-orb-4" />
          <div className="bg-grid" />
          <div className="bg-noise" />
        </div>

        <LanguageProvider>
          {children}
        </LanguageProvider>

        {/* Service Worker registration — client-only, no render */}
        <PwaRegister />
      </body>
    </html>
  );
}
