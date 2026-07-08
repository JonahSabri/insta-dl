import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

/* Shared icon renderer — Instagram gradient background + "JG" logotype */
function JGIcon({ px, maskable = false }: { px: number; maskable?: boolean }) {
  const radius = maskable ? 0 : Math.round(px * 0.22); // maskable: full bleed
  const fontSize = Math.round(px * 0.32);
  const letterSpacing = Math.round(-px * 0.01);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #833ab4 0%, #e1306c 50%, #fcb045 100%)",
        borderRadius: radius,
      }}
    >
      {/* Inner glow circle */}
      <div
        style={{
          position: "absolute",
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* Logotype */}
      <span
        style={{
          color: "white",
          fontSize,
          fontWeight: 900,
          letterSpacing,
          lineHeight: 1,
          textShadow: "0 2px 12px rgba(0,0,0,0.35)",
          fontFamily: "sans-serif",
          display: "flex",
        }}
      >
        JG
      </span>

      {/* Bottom download indicator bar */}
      <div
        style={{
          position: "absolute",
          bottom: Math.round(px * 0.12),
          width: "40%",
          height: Math.round(px * 0.04),
          borderRadius: Math.round(px * 0.02),
          background: "rgba(255,255,255,0.55)",
          display: "flex",
        }}
      />
    </div>
  );
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size: sizeParam } = await params;
  const isMaskable = sizeParam === "512-maskable";
  const px = parseInt(isMaskable ? "512" : sizeParam, 10) || 192;

  return new ImageResponse(<JGIcon px={px} maskable={isMaskable} />, {
    width: px,
    height: px,
  });
}
