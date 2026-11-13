/**
 * STAGE 1 OF 2 — analyse a dump of photos and propose which goes where.
 *
 * Usage:
 *   1. Put every photo in  incoming/   (any names, any sizes, HEIC is fine)
 *   2. pnpm ingest:scan
 *   3. Review/edit  incoming/assignment.json
 *   4. pnpm ingest:build
 *
 * What this can and cannot decide
 * -------------------------------
 * It measures the mechanical things well: orientation, whether resolution is
 * sufficient without upscaling, how much of the frame a crop would discard,
 * and how visually calm the centre is (which is what makes a photo usable
 * behind overlaid text).
 *
 * It cannot judge which arrangement is her best work, which client agreed to
 * be shown, or which photo represents the style she wants to be hired for.
 * The output is a starting proposal to be reviewed, not a decision.
 */

import { readdir, mkdir, writeFile } from "node:fs/promises";
import { extname } from "node:path";
import sharp from "sharp";
import {
  slots,
  ratioLabel,
  orientation,
  exists,
  upscaleFactor,
  MAX_UPSCALE,
  INCOMING_DIR,
  displaySize,
} from "./slots.mjs";

const IN = INCOMING_DIR;
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".heic", ".heif", ".avif"]);

if (!(await exists(IN))) {
  await mkdir(IN, { recursive: true });
  await writeFile(
    `${IN}/README.md`,
    "Drop every photo in this folder, any filenames.\n\n" +
      "Then run `pnpm ingest:scan`, review `assignment.json`, and run `pnpm ingest:build`.\n\n" +
      "This folder is gitignored: originals stay on your machine and never reach the repo.\n",
  );
  console.log(`Created ${IN}/. Put the photos there and run this again.`);
  process.exit(0);
}

const files = (await readdir(IN)).filter((f) => EXTS.has(extname(f).toLowerCase()));

if (files.length === 0) {
  console.log(`No images found in ${IN}/. Supported: ${[...EXTS].join(" ")}`);
  process.exit(0);
}

console.log(`Analysing ${files.length} photo(s)…\n`);

/** Average stddev across channels: a rough proxy for visual busyness. */
const busyness = (stats) =>
  stats.channels.reduce((sum, c) => sum + c.stdev, 0) / stats.channels.length;

const photos = [];

for (const file of files) {
  const path = `${IN}/${file}`;
  try {
    const img = sharp(path).rotate();
    const { width, height } = displaySize(await img.metadata());
    if (!width || !height) throw new Error("no dimensions");

    // Central 40% box: the region text sits over on hero/CTA slots.
    const cw = Math.round(width * 0.4);
    const ch = Math.round(height * 0.4);
    const centre = await img
      .clone()
      .extract({
        left: Math.round((width - cw) / 2),
        top: Math.round((height - ch) / 2),
        width: cw,
        height: ch,
      })
      .stats();

    photos.push({
      file,
      width,
      height,
      megapixels: +((width * height) / 1e6).toFixed(1),
      aspect: +(width / height).toFixed(3),
      orientation: orientation(width, height),
      ratio: ratioLabel(width, height),
      centreBusyness: +busyness(centre).toFixed(1),
    });
  } catch (err) {
    console.log(`  SKIP  ${file}: ${err.message}`);
    if (/heif|heic/i.test(extname(file))) {
      console.log(`        (HEIC needs libvips built with HEIF support. Export as JPEG instead.)`);
    }
  }
}

if (photos.length === 0) {
  console.log("\nNo readable images. Nothing to do.");
  process.exit(1);
}

// --- Scoring ---------------------------------------------------------------

const centreRange = {
  min: Math.min(...photos.map((p) => p.centreBusyness)),
  max: Math.max(...photos.map((p) => p.centreBusyness)),
};

/**
 * 0..1, higher is better.
 *
 * Resolution and orientation are treated as near-disqualifying rather than as
 * mild penalties. An earlier version weighted them softly and cheerfully put
 * an 800x600 phone snap into the 2400x1400 call-to-action that appears on
 * every page. Quality now dominates; spreading photos around is only ever a
 * tiebreaker.
 */
function score(photo, slot) {
  const targetAspect = slot.w / slot.h;
  const scaleNeeded = upscaleFactor(slot, photo.width, photo.height);

  // Hard gate: more than 15% upscale is visibly soft on a photography site.
  // Return almost zero so this only ever wins if nothing else exists.
  if (scaleNeeded > MAX_UPSCALE) return 0.001 / scaleNeeded;

  // Orientation mismatch discards most of the frame. Portrait-into-landscape
  // is the worst case; square is a tolerable compromise either way.
  const slotOrient = orientation(slot.w, slot.h);
  let orientationMatch;
  if (photo.orientation === slotOrient) orientationMatch = 1;
  else if (photo.orientation === "square" || slotOrient === "square") orientationMatch = 0.6;
  else orientationMatch = 0.08;

  // Fraction of the frame surviving the cover-crop.
  const retained =
    photo.aspect > targetAspect ? targetAspect / photo.aspect : photo.aspect / targetAspect;

  // Headroom above the minimum is mildly good: more room to crop well.
  const resolution = Math.min(1, 1 / scaleNeeded);

  // Calm centre matters only where text sits on top. Scores are only ever
  // compared photo-against-photo within one slot, so a term that is constant
  // across candidates cannot change the outcome: it is simply omitted rather
  // than added as a flat 0.1, which used to make the weights look like they
  // summed to 1.0 when for non-quiet slots they sum to 0.80.
  const quietBonus =
    slot.quiet && centreRange.max > centreRange.min
      ? (1 - (photo.centreBusyness - centreRange.min) / (centreRange.max - centreRange.min)) * 0.2
      : 0;

  return orientationMatch * 0.42 + retained * 0.22 + resolution * 0.16 + quietBonus;
}

// Assignment.
//
// Slots pick in order of how visible they are (`rank` in slots.mjs), so the
// home hero and the site-wide call-to-action choose before a divider band.
// Reuse carries a mild compounding penalty, enough to spread photos around
// without ever forcing an unusable match: reusing one good photo beats
// shipping a soft or badly cropped one.
const REUSE_PENALTY = 0.8;

const ordered = [...slots].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));

const assigned = new Map();
const useCount = new Map();

const effectiveScore = (photo, slot) =>
  score(photo, slot) * Math.pow(REUSE_PENALTY, useCount.get(photo.file) ?? 0);

for (const slot of ordered) {
  // `photos` is guaranteed non-empty: the script exits earlier if nothing was
  // readable, so reduce always produces a winner and needs no guard.
  const best = photos.reduce((a, b) =>
    effectiveScore(b, slot) > effectiveScore(a, slot) ? b : a,
  );
  assigned.set(slot.path, best);
  useCount.set(best.file, (useCount.get(best.file) ?? 0) + 1);
}

const unused = photos.filter((p) => !useCount.has(p.file));

// --- Report ----------------------------------------------------------------

console.log("\nPHOTOS\n");
console.log("  file                                 size        ratio    orient     MP   centre-busy");
for (const p of [...photos].sort((a, b) => a.centreBusyness - b.centreBusyness)) {
  console.log(
    `  ${p.file.slice(0, 34).padEnd(36)} ${String(p.width + "x" + p.height).padEnd(11)} ` +
      `${p.ratio.padEnd(8)} ${p.orientation.padEnd(10)} ${String(p.megapixels).padStart(4)}   ${String(p.centreBusyness).padStart(6)}`,
  );
}
console.log("\n  (lower centre-busy = calmer middle = better behind overlaid text)");

console.log("\nPROPOSED ASSIGNMENT\n");
const warnings = [];
for (const slot of slots) {
  const a = assigned.get(slot.path);
  const scaleNeeded = upscaleFactor(slot, a.width, a.height);
  const flags = [];
  if (scaleNeeded > 1) flags.push(`UPSCALE x${scaleNeeded.toFixed(2)}`);
  if (a.orientation !== orientation(slot.w, slot.h)) flags.push("ORIENTATION");
  if (flags.length) warnings.push(`${slot.role}: ${flags.join(", ")}`);

  console.log(
    `  ${slot.role.padEnd(32)} ${slot.quiet ? "[text]" : "      "} -> ${a.file.slice(0, 30).padEnd(32)}` +
      `${flags.length ? "  ** " + flags.join(", ") : ""}`,
  );
}

if (warnings.length) {
  console.log("\nWARNINGS\n");
  for (const w of warnings) console.log(`  ${w}`);
  console.log("\n  UPSCALE means the source is too small and will look soft. Supply a larger file.");
  console.log("  ORIENTATION means a heavy crop: most of the frame gets discarded.");
}

if (unused.length) {
  console.log("\nNOT USED\n");
  for (const p of unused) {
    console.log(`  ${p.file}  (${p.width}x${p.height}, ${p.orientation})`);
  }
  console.log("\n  These are spare. Use them for portfolio galleries, or reassign by hand.");
}

const out = {
  generated: new Date().toISOString(),
  note:
    "Edit the `source` values freely, then run `pnpm ingest:build`. " +
    "`crop` accepts attention (subject-aware, default), entropy (busiest area), or centre. " +
    "Set `source` to null to leave that slot's existing file untouched.",
  assignments: slots.map((slot) => {
    const a = assigned.get(slot.path);
    return {
      path: slot.path,
      role: slot.role,
      target: `${slot.w}x${slot.h}`,
      textOverlay: slot.quiet,
      source: a ? a.file : null,
      crop: "attention",
    };
  }),
};

await writeFile(`${IN}/assignment.json`, JSON.stringify(out, null, 2) + "\n");
console.log(`\nWrote ${IN}/assignment.json — review it, then: pnpm ingest:build`);
