/**
 * Generates placeholder JPEGs for every slot in scripts/slots.mjs, so the
 * layout is viewable before real photography exists.
 *
 * Run:  pnpm placeholders          (fills only missing files)
 *       pnpm placeholders --force  (regenerates everything)
 *
 * Safe to re-run after real photos land: existing files are skipped.
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";
import {
  slots,
  gallerySlots,
  ratioLabel,
  exists,
  PUBLIC_DIR,
  PLACEHOLDER_MANIFEST,
} from "./slots.mjs";

const FORCE = process.argv.includes("--force");
const OUT = PUBLIC_DIR;
/**
 * Gallery slugs are read out of content/portfolio.ts rather than hardcoded, so
 * adding a gallery there (a content-only edit, as that file's header promises)
 * produces stand-ins for it instead of a broken grid.
 */
const galleryScope = await readFile("content/portfolio.ts", "utf8");
const GALLERIES = [
  ...new Set([...galleryScope.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1])),
];

/**
 * Gradient pairs drawn from the brand palette, so stand-ins read as part of the
 * design rather than as obvious holes.
 *
 * No "REPLACE ME" text is drawn on them any more. That label existed before
 * there was a manifest; `pnpm check` now reports every placeholder by path from
 * .placeholders.json, so the tracking does not depend on defacing the image,
 * and the site is live enough that visible labels are a liability.
 */
const TONES = [
  ["#f7f3eb", "#e0c9bf"], // linen -> sandstone
  ["#e0c9bf", "#cec5cb"], // sandstone -> wisteria
  ["#f7f3eb", "#cec5cb"], // linen -> wisteria
  ["#e9e4dc", "#acb29a"], // warm neutral -> sage
];

// Every slot, with gallery cells expanded per placeholder gallery.
const targets = [
  ...slots,
  ...GALLERIES.flatMap((g) =>
    gallerySlots.map((s) => ({ ...s, path: `/images/portfolio/${g}/${s.suffix}` })),
  ),
];

let written = 0;
let skipped = 0;

for (const [i, slot] of targets.entries()) {
  const file = `${OUT}${slot.path}`;

  if (!FORCE && (await exists(file))) {
    skipped++;
    continue;
  }

  const [from, to] = TONES[i % TONES.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${slot.w}" height="${slot.h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="${slot.w}" height="${slot.h}" fill="url(#g)"/>
  </svg>`;

  await mkdir(dirname(file), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toFile(file);
  console.log(`  write  ${slot.path}  ${slot.w}×${slot.h}`);
  written++;
}

// Record which paths are placeholders so `pnpm check` can flag them.
await writeFile(
  PLACEHOLDER_MANIFEST,
  JSON.stringify(targets.map((t) => t.path), null, 2) + "\n",
);

console.log(`\n${written} written, ${skipped} already present (${targets.length} slots total).`);
