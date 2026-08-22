/**
 * CONTENT COMPLETENESS CHECK
 *
 * Run: pnpm check
 *
 * Exists because the content is edited by an AI agent rather than through a
 * CMS. An agent needs an unambiguous, machine-readable answer to "is this
 * done yet", and a CMS would normally provide that with required fields. This
 * is the substitute.
 *
 * Reports, with file and line:
 *   - remaining TODO markers
 *   - placeholder alt text (an SEO and accessibility loss on an image-led site)
 *   - bracketed [TODO] gaps inside otherwise-real sentences
 *   - image paths referenced by content that do not exist on disk
 *   - images that are still generated placeholders
 *
 * Exits non-zero while anything is outstanding, so it can gate a deploy.
 */

import { readdir, readFile, access } from "node:fs/promises";
import { slots, gallerySlots } from "./slots.mjs";

const exists = (p) => access(p).then(() => true, () => false);

const findings = { todo: [], alt: [], gap: [], missing: [], placeholder: [] };

// --- Scan the content files -----------------------------------------------
const contentFiles = (await readdir("content")).filter((f) => f.endsWith(".ts"));

for (const file of contentFiles) {
  const path = `content/${file}`;
  const lines = (await readFile(path, "utf8")).split("\n");

  lines.forEach((line, i) => {
    const at = `${path}:${i + 1}`;
    const trimmed = line.trim();

    // Skip comment lines: guidance mentioning TODO is not itself a TODO.
    const isComment = trimmed.startsWith("*") || trimmed.startsWith("//") || trimmed.startsWith("/*");

    if (/imageAlt:\s*[`"'].*TODO/i.test(line)) {
      findings.alt.push({ at, text: trimmed });
    } else if (!isComment && /\[TODO[^\]]*\]/i.test(line)) {
      findings.gap.push({ at, text: trimmed.slice(0, 100) });
    } else if (!isComment && /\bTODO\b/.test(line)) {
      findings.todo.push({ at, text: trimmed.slice(0, 100) });
    }
  });
}

// --- Check every referenced image exists ----------------------------------
const referenced = new Set();
for (const file of contentFiles) {
  const src = await readFile(`content/${file}`, "utf8");
  for (const m of src.matchAll(/["'`](\/images\/[^"'`]+\.(?:jpg|jpeg|png|webp))["'`]/g)) {
    referenced.add(m[1]);
  }
}

for (const img of [...referenced].sort()) {
  if (!(await exists(`public${img}`))) findings.missing.push(img);
}

// --- Which images are still placeholders? ---------------------------------
// placeholders.mjs records what it generated; ingest-build prunes that list.
let manifest = [];
try {
  manifest = JSON.parse(await readFile("public/images/.placeholders.json", "utf8"));
} catch {
  // No manifest: either nothing generated, or real photos throughout.
}
findings.placeholder = manifest.filter((p) => referenced.has(p));

// --- Report ---------------------------------------------------------------
const section = (title, items, render) => {
  if (!items.length) return;
  console.log(`\n${title} (${items.length})\n`);
  for (const item of items) console.log(`  ${render(item)}`);
};

section("PLACEHOLDER ALT TEXT — every image needs a real description", findings.alt,
  (f) => `${f.at}\n      ${f.text}`);
section("MISSING IMAGE FILES — referenced by content, not on disk", findings.missing,
  (f) => f);
section("STILL PLACEHOLDER IMAGES — replace with real photos", findings.placeholder,
  (f) => f);
section("UNFILLED FACTS — a real sentence with a [TODO] hole in it", findings.gap,
  (f) => `${f.at}\n      ${f.text}`);
section("TODO MARKERS — copy not yet written", findings.todo,
  (f) => `${f.at}\n      ${f.text}`);

const counts = Object.entries(findings).map(([k, v]) => `${v.length} ${k}`);
const total = Object.values(findings).reduce((n, v) => n + v.length, 0);

console.log(`\n${"-".repeat(60)}`);
console.log(total === 0 ? "Content is complete." : `Outstanding: ${counts.join(", ")}`);
console.log(
  `Slots defined: ${slots.length} fixed + ${gallerySlots.length} per gallery.`,
);

process.exit(total === 0 ? 0 : 1);
