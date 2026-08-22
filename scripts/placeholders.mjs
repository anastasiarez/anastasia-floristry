/**
 * Generates placeholder JPEGs for every slot in scripts/slots.mjs, so the
 * layout is viewable before real photography exists.
 *
 * Run:  pnpm placeholders          (fills only missing files)
 *       pnpm placeholders --force  (regenerates everything)
 *
 * Safe to re-run after real photos land: existing files are skipped.
 */

import { mkdir, access, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";
import { slots, gallerySlots, ratioLabel } from "./slots.mjs";

const FORCE = process.argv.includes("--force");
const OUT = "public";
const PLACEHOLDER_GALLERIES = ["placeholder-one", "placeholder-two"];

// Palette, matching the @theme block in app/globals.css.
const TONES = [
  ["#efede8", "#d9d3c8"],
  ["#e6ded4", "#cbbfae"],
  ["#e9e4dc", "#bf9a7d"],
  ["#ded6ca", "#ae7c65"],
];

// Every slot, with gallery cells expanded per placeholder gallery.
const targets = [
  ...slots,
  ...PLACEHOLDER_GALLERIES.flatMap((g) =>
    gallerySlots.map((s) => ({ ...s, path: `/images/portfolio/${g}/${s.suffix}` })),
  ),
];

const exists = (p) => access(p).then(() => true, () => false);

let written = 0;
let skipped = 0;

for (const [i, slot] of targets.entries()) {
  const file = `${OUT}${slot.path}`;

  if (!FORCE && (await exists(file))) {
    skipped++;
    continue;
  }

  const [from, to] = TONES[i % TONES.length];
  const fs_ = Math.round(Math.min(slot.w, slot.h) * 0.045);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${slot.w}" height="${slot.h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="${slot.w}" height="${slot.h}" fill="url(#g)"/>
    <text x="50%" y="47%" text-anchor="middle" fill="#fff" fill-opacity="0.75"
      font-family="Helvetica, Arial, sans-serif" font-size="${fs_}"
      letter-spacing="${fs_ * 0.12}">REPLACE ME</text>
    <text x="50%" y="53%" text-anchor="middle" fill="#fff" fill-opacity="0.55"
      font-family="Helvetica, Arial, sans-serif" font-size="${fs_ * 0.5}">${slot.path}</text>
    <text x="50%" y="58%" text-anchor="middle" fill="#fff" fill-opacity="0.4"
      font-family="Helvetica, Arial, sans-serif" font-size="${fs_ * 0.42}">${slot.w} × ${slot.h} · ${ratioLabel(slot.w, slot.h)}</text>
  </svg>`;

  await mkdir(dirname(file), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toFile(file);
  console.log(`  write  ${slot.path}  ${slot.w}×${slot.h}`);
  written++;
}

// Record which paths are placeholders so `pnpm check` can flag them.
await writeFile(
  `${OUT}/images/.placeholders.json`,
  JSON.stringify(targets.map((t) => t.path), null, 2) + "\n",
);

console.log(`\n${written} written, ${skipped} already present (${targets.length} slots total).`);
