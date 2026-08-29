import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JazzGhost — Instagram Tools",
    short_name: "JazzGhost",
    description:
      "Free Instagram tools: Reels, posts, stories, highlights, bio and caption — no sign-up required.",
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
        url: "/en/instagram-reels-downloader",
        icons: [{ src: "/pwa-icon/96", sizes: "96x96", type: "image/png" }],
      },
      {
        name: "Download Post",
        short_name: "Post",
        description: "Download an Instagram Post",
        url: "/en/instagram-post-downloader",
        icons: [{ src: "/pwa-icon/96", sizes: "96x96", type: "image/png" }],
      },
    ],
    screenshots: [],
  };
}
