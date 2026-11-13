/**
 * STAGE 2 OF 2 — produce the final site images from the reviewed assignment.
 *
 * Usage:  pnpm ingest:build            (writes files)
 *         pnpm ingest:build --dry      (reports what it would do)
 *
 * Reads incoming/assignment.json. For each slot with a `source`:
 *   1. applies EXIF orientation, so phone photos are not sideways
 *   2. cover-crops to the slot's exact dimensions using the chosen strategy
 *   3. strips ALL metadata, including GPS
 *   4. writes progressive JPEG with mozjpeg at quality 82
 *
 * Why JPEG and not WebP/AVIF
 * --------------------------
 * next/image already negotiates AVIF and WebP per browser and generates every
 * responsive size from the source at build time. Pre-converting the source to
 * WebP would mean lossy-on-lossy re-encoding for zero benefit. The source of
 * truth should be the highest-quality JPEG we can produce.
 *
 * Why strip metadata
 * ------------------
 * Wedding photos are routinely geotagged. Publishing the originals would leak
 * the venue's GPS coordinates and the client's event date. `.withMetadata()`
 * is deliberately NOT called.
 */

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";
import {
  slots,
  ratioLabel,
  upscaleFactor,
  MAX_UPSCALE,
  PUBLIC_DIR,
  INCOMING_DIR,
  PLACEHOLDER_MANIFEST,
  displaySize,
} from "./slots.mjs";

const IN = INCOMING_DIR;
const OUT = PUBLIC_DIR;
const DRY = process.argv.includes("--dry");
const QUALITY = 82;
const VALID_CROPS = new Set(["attention", "entropy", "centre", "center", "top", "bottom", "left", "right"]);

let manifest;
try {
  manifest = JSON.parse(await readFile(`${IN}/assignment.json`, "utf8"));
} catch {
  console.error(`Could not read ${IN}/assignment.json. Run \`pnpm ingest:scan\` first.`);
  process.exit(1);
}

const bySlot = new Map(slots.map((s) => [s.path, s]));

const replaced = [];
let written = 0;
let skipped = 0;
let failed = 0;
const warnings = [];

console.log(DRY ? "DRY RUN — nothing will be written\n" : "Building images…\n");

for (const entry of manifest.assignments) {
  const slot = bySlot.get(entry.path);
  if (!slot) {
    warnings.push(`${entry.path}: not a known slot, ignored. Check scripts/slots.mjs.`);
    continue;
  }
  if (!entry.source) {
    skipped++;
    continue;
  }

  const src = `${IN}/${entry.source}`;
  const dest = `${OUT}${slot.path}`;

  let position = entry.crop ?? "attention";
  if (!VALID_CROPS.has(position)) {
    warnings.push(`${slot.role}: unknown crop "${position}", using attention.`);
    position = "attention";
  }

  try {
    const pipeline = sharp(src).rotate(); // EXIF orientation
    const meta = displaySize(await pipeline.metadata());

    const scaleNeeded = upscaleFactor(slot, meta.width, meta.height);
    if (scaleNeeded > 1) {
      // MAX_UPSCALE is the scanner's disqualification threshold; anything above
      // it only reaches here via a hand-edited assignment.json.
      const severity = scaleNeeded > MAX_UPSCALE ? "TOO SMALL" : "slightly upscaled";
      warnings.push(
        `${slot.role}: ${severity} — source ${meta.width}x${meta.height} vs ` +
          `${slot.w}x${slot.h}, scaled ${scaleNeeded.toFixed(2)}x.`,
      );
    }

    if (DRY) {
      console.log(
        `  would write  ${slot.path.padEnd(44)} ${slot.w}x${slot.h}  ` +
          `from ${entry.source} (${meta.width}x${meta.height}, crop=${position})`,
      );
      written++;
      continue;
    }

    await mkdir(dirname(dest), { recursive: true });
    await pipeline
      .resize(slot.w, slot.h, { fit: "cover", position, withoutEnlargement: false })
      .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
      .toFile(dest);

    replaced.push(slot.path);
    const { size } = await stat(dest);
    console.log(
      `  ${slot.path.padEnd(44)} ${String(slot.w + "x" + slot.h).padEnd(10)} ` +
        `${ratioLabel(slot.w, slot.h).padEnd(6)} ${(size / 1024).toFixed(0).padStart(4)} KB   <- ${entry.source}`,
    );
    written++;
  } catch (err) {
    console.error(`  FAILED  ${slot.path}: ${err.message}`);
    failed++;
  }
}

// Any slot we just filled with a real photo is no longer a placeholder.
if (!DRY && replaced.length) {
  try {
    const file = PLACEHOLDER_MANIFEST;
    const manifest = JSON.parse(await readFile(file, "utf8"));
    await writeFile(
      file,
      JSON.stringify(manifest.filter((p) => !replaced.includes(p)), null, 2) + "\n",
    );
  } catch {
    // No manifest to prune.
  }
}

console.log(
  `\n${written} ${DRY ? "would be written" : "written"}, ${skipped} left as-is, ${failed} failed.`,
);

if (warnings.length) {
  console.log("\nWARNINGS\n");
  for (const w of warnings) console.log(`  ${w}`);
}

if (!DRY && written > 0) {
  console.log(
    "\nNext: every image needs real alt text. Edit the `imageAlt` fields in\n" +
      "content/pages.ts, content/services.ts and content/portfolio.ts, then run\n" +
      "`pnpm check` to confirm no placeholder alt text remains.",
  );
}

// A failed image must fail the command, or a half-finished ingest looks done.
if (failed > 0) process.exit(1);
