/**
 * THE IMAGE SLOT MANIFEST — single source of truth.
 *
 * Consumed by:
 *   scripts/placeholders.mjs   generates stand-in images
 *   scripts/ingest-scan.mjs    matches her photos to slots
 *   scripts/ingest-build.mjs   produces the final files
 *   scripts/photo-brief.mjs    regenerates docs/photo-brief.md
 *
 * Adding an image to the site means adding it here, then referencing the
 * path from a file in content/.
 *
 * Fields:
 *   path      final location under public/, referenced by content/
 *   w, h      target pixels. The output is cover-cropped to exactly this.
 *   role      human label used in reports and the photo brief
 *   quiet     true if text is overlaid, so the centre must be uncluttered.
 *             The scanner scores candidates on centre calmness for these.
 *   note      guidance for whoever is choosing the photo
 *   rank      how visible the slot is, 1 = most. Drives who gets first pick of
 *             the photos during ingest. The home hero and the site-wide CTA
 *             matter far more than a divider band, so they choose first.
 */

export const slots = [
  { path: "/images/home/hero.jpg", w: 2400, h: 1600, role: "Home hero", quiet: true, rank: 1,
    note: "The most important photo on the site. Full-screen behind the studio name." },
  { path: "/images/home/approach.jpg", w: 1200, h: 1500, role: "Home — approach block", quiet: false, rank: 6,
    note: "Beside the seasonal-design text. A working or detail shot beats a wide venue shot." },
  { path: "/images/home/band.jpg", w: 2400, h: 1400, role: "Home — full-width band", quiet: false, rank: 11,
    note: "Full-width divider. No text over it. Parallax on desktop, so depth helps." },
  { path: "/images/home/cta.jpg", w: 2400, h: 1400, role: "Closing call-to-action", quiet: true, rank: 2,
    note: "Appears at the bottom of EVERY page behind white text and a button. Choose deliberately." },

  { path: "/images/about/hero.jpg", w: 2400, h: 1400, role: "About hero", quiet: true, rank: 8,
    note: "Banner. Text overlaid centred." },
  { path: "/images/about/portrait.jpg", w: 1200, h: 1500, role: "Portrait of Anastasia", quiet: false, rank: 3,
    note: "A photo of her, ideally working with flowers rather than a posed headshot." },
  { path: "/images/about/band.jpg", w: 2400, h: 1200, role: "About — band", quiet: false, rank: 12,
    note: "Full-width divider. No text." },

  { path: "/images/services/hero.jpg", w: 2400, h: 1400, role: "Services hero", quiet: true, rank: 9,
    note: "Banner. Text overlaid centred." },
  { path: "/images/services/band.jpg", w: 2400, h: 1200, role: "Services — band", quiet: false, rank: 13,
    note: "Full-width divider. No text." },
  { path: "/images/services/signature-weddings.jpg", w: 1200, h: 1500, role: "Service: Signature Weddings", quiet: false, rank: 4,
    note: "A full wedding look. Ceremony installation or a hero bouquet." },
  { path: "/images/services/intimate-celebrations.jpg", w: 1200, h: 1500, role: "Service: Intimate Celebrations", quiet: false, rank: 5,
    note: "Smaller scale: refined table arrangements, or a single statement ceremony piece." },

  { path: "/images/portfolio/hero.jpg", w: 2400, h: 1400, role: "Portfolio hero", quiet: true, rank: 7,
    note: "Banner. Text overlaid centred." },
  { path: "/images/contact/hero.jpg", w: 2400, h: 1400, role: "Contact hero", quiet: true, rank: 10,
    note: "Banner. Text overlaid centred." },
];

/** Gallery cells repeat per gallery. 01 is the tall anchor cell. */
export const gallerySlots = [
  { suffix: "01.jpg", w: 1000, h: 1400, role: "Gallery — tall cell", quiet: false,
    note: "Portrait. Spans two grid rows, so it anchors the layout. Use the strongest image." },
  { suffix: "02.jpg", w: 1200, h: 900, role: "Gallery — wide cell", quiet: false, note: "Landscape." },
  { suffix: "03.jpg", w: 1200, h: 900, role: "Gallery — wide cell", quiet: false, note: "Landscape." },
];

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/**
 * Common photographic ratios, so real camera dimensions get a readable label.
 * A raw gcd reduction is useless here: gcd(4000, 2667) is 1, which would print
 * "4000:2667" instead of "3:2".
 */
const COMMON = [
  [1, 1], [5, 4], [4, 3], [3, 2], [16, 10], [16, 9], [2, 1], [21, 9],
  [4, 5], [3, 4], [2, 3], [5, 7], [10, 16], [9, 16], [12, 7], [7, 12],
];

/** "4:5", "3:2", falling back to a decimal for genuinely odd crops. */
export function ratioLabel(w, h) {
  const target = w / h;

  // Exact reduction first: it is correct and readable for designed sizes.
  const g = gcd(w, h);
  if (w / g <= 24 && h / g <= 24) return `${w / g}:${h / g}`;

  // Otherwise snap to the nearest common ratio within 2%.
  let best = null;
  for (const [a, b] of COMMON) {
    const diff = Math.abs(a / b - target) / target;
    if (diff < 0.02 && (!best || diff < best.diff)) best = { a, b, diff };
  }
  if (best) return `~${best.a}:${best.b}`;

  return `${target.toFixed(2)}:1`;
}

export function orientation(w, h) {
  return w > h ? "landscape" : w < h ? "portrait" : "square";
}
