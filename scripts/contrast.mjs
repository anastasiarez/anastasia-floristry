/**
 * WCAG 2.1 AA contrast audit of the palette as it is actually used.
 *
 * Run: pnpm contrast
 *
 * The reference design this site's look came from failed AA on 7 of 9 text
 * combinations. This script exists so that never silently comes back. If you
 * add a new text/background pairing, add it to CHECKS.
 *
 * Exits non-zero on any failure, so it can gate CI.
 */

import { readFile } from "node:fs/promises";

const hex = (h) => { const n = h.replace('#',''); return [0,2,4].map(i => parseInt(n.slice(i,i+2),16)); };
const lin = (c) => { c /= 255; return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
const lum = (h) => { const [r,g,b] = hex(h).map(lin); return 0.2126*r + 0.7152*g + 0.0722*b; };
const ratio = (a,b) => { const [x,y] = [lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };

/**
 * Palette, parsed out of the real source rather than copied.
 *
 * This script is the gate that proves the palette clears AA. When it kept its
 * own copy of the hex values, editing a colour in globals.css and forgetting
 * to update here left the audit reporting PASS for a palette the site no
 * longer used: a guard that silently validates the wrong values.
 */
const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

const C = Object.fromEntries(
  [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)].map(([, name, hex]) => [
    name.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
    hex.toLowerCase(),
  ]),
);

const required = ["cream", "linen", "taupe", "tan", "clay", "ink", "text", "accent", "clayTx"];
const missing = required.filter((k) => !C[k]);
if (missing.length) {
  console.error(`Could not parse these tokens from app/globals.css: ${missing.join(", ")}`);
  process.exit(1);
}
C.white = "#ffffff";

// [description, fg, bg, largeText]
// large = rendered at >=24px, which AA allows at 3:1 instead of 4.5:1.
const CHECKS = [
  ['body copy on cream',            C.text,   C.cream, false],
  ['body copy on linen',            C.text,   C.linen, false],
  ['eyebrow label on cream',        C.accent, C.cream, false],
  ['eyebrow label on linen',        C.accent, C.linen, false],
  ['footer copyright on linen',     C.text,   C.linen, false],
  ['field label on cream',          C.text,   C.cream, false],
  ['field hint on cream',           C.text,   C.cream, false],
  ['form error on cream',           C.clayTx, C.cream, false],
  ['numbered step numerals',        C.accent, C.linen, false],
  ['display heading on cream',      C.taupe,  C.cream, true],
  ['display heading on linen',      C.taupe,  C.linen, true],
  ['script accent on cream',        C.clay,   C.cream, true],
  ['script accent on linen',        C.clay,   C.linen, true],
  ['hero type on scrim',            C.white,  C.ink,   true],
  ['link hover on cream',           C.olive,  C.cream, false],
  ['link hover on linen',           C.olive,  C.linen, false],
];

console.log('WCAG 2.1 AA — normal text 4.5:1, large text (>=24px) 3:1\n');

let fails = 0;
for (const [label, fg, bg, large] of CHECKS) {
  const r = ratio(fg, bg);
  const need = large ? 3.0 : 4.5;
  const ok = r >= need;
  if (!ok) fails++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  need ${need.toFixed(1)}  ${label}`);
}

console.log(fails ? `\n${fails} failing combination(s).` : '\nAll combinations pass AA.');
process.exit(fails ? 1 : 0);
