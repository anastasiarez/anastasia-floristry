import { ImageResponse } from "next/og";
import { site } from "@/content/site";

/** Palette-only social card so it stays legible without depending on photos. */

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const name = site.name.toUpperCase();
  const pad = 60;
  const usable = size.width - pad * 2;
  const tracking = 10;
  // Advance width ≈ fontSize * 0.62 + tracking; fit the longest name on the canvas.
  const fontSize = Math.max(
    28,
    Math.min(76, Math.floor((usable / name.length - tracking) / 0.62)),
  );

  // ImageResponse cannot use CSS variables; hexes match app/globals.css tokens.
  const cream = "#fdfcfa";
  const linen = "#efede8";
  const taupe = "#908779";
  const text = "#726b5f";
  const accent = "#806754";
  const hairline = { width: 64, height: 1, backgroundColor: accent };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: `0 ${pad}px`,
          backgroundColor: cream,
          backgroundImage: `linear-gradient(135deg, ${linen} 0%, ${cream} 45%, ${linen} 100%)`,
          color: text,
          fontFamily: "sans-serif",
        }}
      >
        <div style={hairline} />

        <div
          style={{
            marginTop: 40,
            fontSize,
            letterSpacing: tracking,
            color: taupe,
            display: "flex",
            maxWidth: usable,
            textAlign: "center",
          }}
        >
          {name}
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: accent,
            display: "flex",
          }}
        >
          {site.tagline}
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 22,
            letterSpacing: 3,
            color: text,
            display: "flex",
          }}
        >
          {site.location.city}, {site.location.region}
        </div>

        <div style={{ ...hairline, marginTop: 40 }} />
      </div>
    ),
    size,
  );
}
