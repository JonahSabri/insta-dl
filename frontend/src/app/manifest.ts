import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JazzGhost — Instagram Downloader",
    short_name: "JazzGhost",
    description:
      "Free Instagram Reels, Posts, Carousels & Stories downloader. No sign-up, no app needed.",
    start_url: "/en",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    background_color: "#060610",
    theme_color: "#833ab4",
    orientation: "portrait-primary",
    categories: ["utilities", "social"],
    lang: "en",
    dir: "ltr",
    prefer_related_applications: false,
    icons: [
      {
        src: "/pwa-icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa-icon/512-maskable",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Download Reel",
        short_name: "Reel",
        description: "Download an Instagram Reel",
        url: "/en?type=reel",
        icons: [{ src: "/pwa-icon/96", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Download Post",
        short_name: "Post",
        description: "Download an Instagram Post",
        url: "/en?type=post",
        icons: [{ src: "/pwa-icon/96", sizes: "96x96", type: "image/png" }],
      },
    ],
    screenshots: [],
  };
}
