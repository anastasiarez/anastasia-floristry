/**
 * PORTFOLIO
 *
 * Each entry is one gallery. To add a wedding: drop the photos into
 * public/images/portfolio/<slug>/ and add an entry here.
 *
 * `featured: true` also surfaces the gallery's cover on the home page.
 */

export type Gallery = {
  slug: string;
  title: string;
  /** Short caption, e.g. venue and season. */
  caption: string;
  featured?: boolean;
  /** First image is the cover. */
  images: { src: string; alt: string }[];
};

export const galleries: Gallery[] = [
  {
    slug: "placeholder-one",
    title: "TODO Wedding Name",
    caption: "TODO venue, season",
    featured: true,
    images: [
      { src: "/images/portfolio/placeholder-one/01.jpg", alt: "TODO" },
      { src: "/images/portfolio/placeholder-one/02.jpg", alt: "TODO" },
      { src: "/images/portfolio/placeholder-one/03.jpg", alt: "TODO" },
    ],
  },
  {
    slug: "placeholder-two",
    title: "TODO Wedding Name",
    caption: "TODO venue, season",
    featured: true,
    images: [
      { src: "/images/portfolio/placeholder-two/01.jpg", alt: "TODO" },
      { src: "/images/portfolio/placeholder-two/02.jpg", alt: "TODO" },
      { src: "/images/portfolio/placeholder-two/03.jpg", alt: "TODO" },
    ],
  },
];

/**
 * Cell `01` of every gallery is the tall anchor cell (1000x1400 portrait); the
 * rest are landscape. That is defined once in `scripts/slots.mjs`, which
 * generates and crops the files, so the layout is derived from the filename
 * rather than restated per image.
 *
 * It used to be a hand-set `portrait: true` flag and it had already drifted:
 * one portrait image was unmarked and one landscape image was marked, so the
 * grid stretched a 4:3 photo across two rows and squeezed a 5:7 into one.
 */
const isTallCell = (src: string) => /\/01\.(?:jpe?g|png|webp)$/i.test(src);

/** Gallery images with their grid span resolved. */
export function galleryCells(images: Gallery["images"]) {
  return images.map((img) => ({ ...img, tall: isTallCell(img.src) }));
}
