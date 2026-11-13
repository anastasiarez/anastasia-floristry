import Image from "next/image";

type HeroProps = {
  /** Rendered as the page h1. Pass two parts to break across lines. */
  titleTop: string;
  titleBottom?: string;
  /** Small tracked label above the title. */
  eyebrow?: string;
  /** One line below the title. */
  subtitle?: string;
  image: string;
  imageAlt: string;
  /** Full viewport height, for the home page. Otherwise a shorter band. */
  full?: boolean;
};

/**
 * Full-bleed image hero with overlaid type.
 *
 * A `.scrim` darkens the photo behind the white text (see globals.css).
 * Pick hero photos with a mid-tone centre: on a near-white centre the small
 * eyebrow and subtitle can still fall short of AA.
 *
 * `preload` is set because the hero is always the largest contentful paint
 * on its page.
 */
export function Hero({
  titleTop,
  titleBottom,
  eyebrow,
  subtitle,
  image,
  imageAlt,
  full = false,
}: HeroProps) {
  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden ${
        full ? "min-h-[85svh]" : "min-h-[40svh] md:min-h-[55svh]"
      }`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden className="scrim absolute inset-0" />
      <div className="on-dark relative px-(--spacing-gutter) text-center text-linen">
        {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}

        <h1 className={full ? "text-display-hero font-myroge" : "text-display-lg"}>
          {titleTop}
          {titleBottom && (
            <>
              <br />
              {titleBottom}
            </>
          )}
        </h1>

        {subtitle && <p className="eyebrow mt-10">{subtitle}</p>}
      </div>
    </section>
  );
}
