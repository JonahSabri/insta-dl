import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "JazzGhost — Free Instagram Downloader";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "JazzGhost";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "linear-gradient(135deg, #060610 0%, #1a0b2e 40%, #3b0764 70%, #831843 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#833ab4,#e1306c,#fcb045)",
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            JG
          </div>
          <div style={{ fontSize: 36, fontWeight: 800 }}>{siteName}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            Free Instagram Reels & Posts Downloader
          </div>
          <div style={{ fontSize: 28, color: "#d8b4fe", maxWidth: 900 }}>
            HD quality · No sign-up · Reels, Posts, Stories & Carousels
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#94a3b8",
          }}
        >
          <div>Paste link → Preview → Download</div>
          <div style={{ color: "#fcb045", fontWeight: 700 }}>jazzghost.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
