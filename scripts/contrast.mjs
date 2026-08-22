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

const hex = (h) => { const n = h.replace('#',''); return [0,2,4].map(i => parseInt(n.slice(i,i+2),16)); };
const lin = (c) => { c /= 255; return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
const lum = (h) => { const [r,g,b] = hex(h).map(lin); return 0.2126*r + 0.7152*g + 0.0722*b; };
const ratio = (a,b) => { const [x,y] = [lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };

// Must mirror the @theme block in app/globals.css.
const C = {
  cream:  '#fdfcfa',
  linen:  '#efede8',
  taupe:  '#908779',
  tan:    '#bf9a7d',
  clay:   '#ae7c65',
  ink:    '#403e3a',
  text:   '#726b5f',
  accent: '#806754',
  clayTx: '#8a6350',
  white:  '#ffffff',
};

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
