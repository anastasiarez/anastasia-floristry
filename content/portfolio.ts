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
  images: { src: string; alt: string; /** portrait images get a taller cell */ portrait?: boolean }[];
};

export const galleries: Gallery[] = [
  {
    slug: "placeholder-one",
    title: "TODO Wedding Name",
    caption: "TODO venue, season",
    featured: true,
    images: [
      { src: "/images/portfolio/placeholder-one/01.jpg", alt: "TODO", portrait: true },
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
      { src: "/images/portfolio/placeholder-two/02.jpg", alt: "TODO", portrait: true },
      { src: "/images/portfolio/placeholder-two/03.jpg", alt: "TODO" },
    ],
  },
];

/** Flat list of every image, used by the portfolio grid. */
export const allImages = galleries.flatMap((g) =>
  g.images.map((img) => ({ ...img, gallery: g.slug, galleryTitle: g.title })),
);
