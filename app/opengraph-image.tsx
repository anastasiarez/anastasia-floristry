import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { cacheLife } from "next/cache";
import { site } from "@/content/site";

/**
 * Social card: the real brand lockup on the brand colours, so it matches the
 * site header and logo instead of re-setting the name in a generic font.
 * Photo-free on purpose, so it stays legible before real photos arrive.
 */

export const alt = `${site.name}, ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse cannot read CSS variables; these match app/globals.css tokens.
const linen = "#f7f3eb";
const sandstone = "#e0c9bf";
const ink = "#1f2936";
const mauve = "#9e7e81";

/**
 * The lockup as a data URL. Cached because a file read is I/O: without it,
 * Cache Components renders this card on every request instead of at build.
 */
async function lockupDataUrl() {
  "use cache";
  cacheLife("max");
  const svg = await readFile(join(process.cwd(), "public/brand/lockup-ink.svg"));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}

export default async function OpengraphImage() {
  const lockup = await lockupDataUrl();
  const hairline = { width: 64, height: 1, backgroundColor: mauve };

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
          backgroundColor: linen,
          backgroundImage: `linear-gradient(135deg, ${sandstone} 0%, ${linen} 45%, ${sandstone} 100%)`,
          color: ink,
          fontFamily: "sans-serif",
        }}
      >
        <div style={hairline} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={lockup} alt="" width={900} height={182} style={{ marginTop: 48 }} />
        <div
          style={{
            marginTop: 44,
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          {site.location.areaName}
        </div>
        <div style={{ ...hairline, marginTop: 48 }} />
      </div>
    ),
    size,
  );
}
