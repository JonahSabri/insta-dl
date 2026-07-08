import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #833ab4 0%, #e1306c 55%, #fcb045 100%)",
        borderRadius: 40,
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: "65%",
          height: "65%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* Logotype */}
      <span
        style={{
          color: "white",
          fontSize: 58,
          fontWeight: 900,
          letterSpacing: -2,
          lineHeight: 1,
          fontFamily: "sans-serif",
          textShadow: "0 3px 16px rgba(0,0,0,0.3)",
          display: "flex",
        }}
      >
        JG
      </span>

      {/* Bottom bar accent */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
          width: "38%",
          height: 7,
          borderRadius: 4,
          background: "rgba(255,255,255,0.5)",
          display: "flex",
        }}
      />
    </div>,
    { ...size },
  );
}
