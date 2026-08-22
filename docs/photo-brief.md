# Photo brief

What to supply, and at what size. Generated from `scripts/slots.mjs` — do not
edit this file by hand, run `pnpm brief` instead.

**13 fixed images, plus 3 per portfolio gallery.**

## The easy way

Drop everything into `incoming/` and run `pnpm ingest:scan`. It measures each
photo, proposes which one fits which slot, and flags anything too small or
wrongly oriented. Then `pnpm ingest:build` crops and writes the final files.
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

| Where it goes | Path | Min size (px) | Ratio | Orientation | Text over it? | Notes |
|---|---|---|---|---|---|---|
| Home hero | `/images/home/hero.jpg` | 2400 × 1600 | 3:2 | landscape | **yes** | The most important photo on the site. Full-screen behind the studio name. |
| Closing call-to-action | `/images/home/cta.jpg` | 2400 × 1400 | 12:7 | landscape | **yes** | Appears at the bottom of EVERY page behind white text and a button. Choose deliberately. |
| Portrait of Anastasia | `/images/about/portrait.jpg` | 1200 × 1500 | 4:5 | portrait | no | A photo of her, ideally working with flowers rather than a posed headshot. |
| Service: Signature Weddings | `/images/services/signature-weddings.jpg` | 1200 × 1500 | 4:5 | portrait | no | A full wedding look. Ceremony installation or a hero bouquet. |
| Service: Intimate Celebrations | `/images/services/intimate-celebrations.jpg` | 1200 × 1500 | 4:5 | portrait | no | Smaller scale: refined table arrangements, or a single statement ceremony piece. |
| Home — approach block | `/images/home/approach.jpg` | 1200 × 1500 | 4:5 | portrait | no | Beside the seasonal-design text. A working or detail shot beats a wide venue shot. |
| Portfolio hero | `/images/portfolio/hero.jpg` | 2400 × 1400 | 12:7 | landscape | **yes** | Banner. Text overlaid centred. |
| About hero | `/images/about/hero.jpg` | 2400 × 1400 | 12:7 | landscape | **yes** | Banner. Text overlaid centred. |
| Services hero | `/images/services/hero.jpg` | 2400 × 1400 | 12:7 | landscape | **yes** | Banner. Text overlaid centred. |
| Contact hero | `/images/contact/hero.jpg` | 2400 × 1400 | 12:7 | landscape | **yes** | Banner. Text overlaid centred. |
| Home — full-width band | `/images/home/band.jpg` | 2400 × 1400 | 12:7 | landscape | no | Full-width divider. No text over it. Parallax on desktop, so depth helps. |
| About — band | `/images/about/band.jpg` | 2400 × 1200 | 2:1 | landscape | no | Full-width divider. No text. |
| Services — band | `/images/services/band.jpg` | 2400 × 1200 | 2:1 | landscape | no | Full-width divider. No text. |

## Per portfolio gallery

Each gallery needs at least 3 photos. Pick a short slug like
`smith-wedding`, then add the gallery to `content/portfolio.ts`.

| Where it goes | Path | Min size (px) | Ratio | Orientation | Text over it? | Notes |
|---|---|---|---|---|---|---|
| Gallery — tall cell | `/images/portfolio/<gallery>/01.jpg` | 1000 × 1400 | 5:7 | portrait | no | Portrait. Spans two grid rows, so it anchors the layout. Use the strongest image. |
| Gallery — wide cell | `/images/portfolio/<gallery>/02.jpg` | 1200 × 900 | 4:3 | landscape | no | Landscape. |
| Gallery — wide cell | `/images/portfolio/<gallery>/03.jpg` | 1200 × 900 | 4:3 | landscape | no | Landscape. |

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
