/**
 * Regenerates docs/photo-brief.md from scripts/slots.mjs.
 *
 * Run: pnpm brief
 *
 * The brief is generated rather than hand-written so it can never drift from
 * the slots the code actually uses. It drifted once already, when the three
 * invented services were replaced with her real two.
 */

import { writeFile } from "node:fs/promises";
import { slots, gallerySlots, ratioLabel, orientation } from "./slots.mjs";

const row = (s, path) =>
  `| ${s.role} | \`${path}\` | ${s.w} × ${s.h} | ${ratioLabel(s.w, s.h)} | ` +
  `${orientation(s.w, s.h)} | ${s.quiet ? "**yes**" : "no"} | ${s.note} |`;

const header =
  "| Where it goes | Path | Min size (px) | Ratio | Orientation | Text over it? | Notes |\n" +
  "|---|---|---|---|---|---|---|";

const byRank = [...slots].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));

const md = `# Photo brief

What to supply, and at what size. Generated from \`scripts/slots.mjs\` — do not
edit this file by hand, run \`pnpm brief\` instead.

**${slots.length} fixed images, plus ${gallerySlots.length} per portfolio gallery.**

## The easy way

Drop everything into \`incoming/\` and run \`pnpm ingest:scan\`. It measures each
photo, proposes which one fits which slot, and flags anything too small or
wrongly oriented. Then \`pnpm ingest:build\` crops and writes the final files.
You only need the table below if you want to place photos by hand.

## Export settings

- **Format** JPEG. **Colour profile** sRGB, not Adobe RGB, which looks dull in browsers.
- **Quality** 80–85. Next.js re-encodes and generates every responsive size, so
  maxing quality gains nothing. Do not pre-convert to WebP: that is lossy-on-lossy.
- **Do not upscale.** If a photo is smaller than its slot, send the original and
  the ingest script will flag it.
- Sizes below are minimums. Larger is better, it leaves room for a good crop.
- **Instagram exports are capped near 1080px.** Fine for gallery cells, too small
  for any hero.

## Fixed images

Listed most visible first, so if time is short, start at the top.

${header}
${byRank.map((s) => row(s, s.path)).join("\n")}

## Per portfolio gallery

Each gallery needs at least ${gallerySlots.length} photos. Pick a short slug like
\`smith-wedding\`, then add the gallery to \`content/portfolio.ts\`.

${header}
${gallerySlots.map((s) => row(s, `/images/portfolio/<gallery>/${s.suffix}`)).join("\n")}

## Things that will bite

1. **The "text over it" column matters.** Those slots have headings sitting on
   top, so a busy centre makes the words unreadable. The ingest script scores
   candidates on how calm their middle is, but a photo with the subject dead
   centre will always fight the type.
2. **The closing call-to-action appears on every page.** Choose it deliberately.
3. **Every photo needs a one-line description** for its alt text, for example
   "blush garden roses and trailing ivy in a footed urn". This is what a screen
   reader announces and what Google and AI assistants read. Send these alongside
   the files.
4. **Portrait and landscape are not interchangeable.** A landscape photo forced
   into a 4:5 portrait slot loses most of its width.
5. **She must own the photos, or have the photographer's written permission.**
   Wedding photographers routinely licence images to vendors, but it needs
   asking. Credit them in the footer if the licence requires it.
6. **EXIF is stripped on build.** Wedding photos are often geotagged with the
   venue, which would otherwise be published. Nothing to do, just be aware it
   is handled.
`;

await writeFile("docs/photo-brief.md", md);
console.log(`docs/photo-brief.md regenerated: ${slots.length} fixed slots + ${gallerySlots.length} gallery cells.`);
