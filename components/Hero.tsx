import Image from "next/image";

type HeroProps = {
  /** Rendered as the page h1. Pass two parts to break across lines. */
  titleTop: string;
  titleBottom?: string;
  /** Script accent, positioned over the title. */
  accent?: string;
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
 * The image is darkened just enough for white text to hold contrast at
 * AA. `priority` is set because this is always the largest contentful
 * paint on the page it appears on.
 */
export function Hero({
  titleTop,
  titleBottom,
  accent,
  eyebrow,
  subtitle,
  image,
  imageAlt,
  full = false,
}: HeroProps) {
  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden ${
        full ? "min-h-[85svh]" : "min-h-[55svh]"
      }`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="relative px-(--spacing-gutter) text-center text-white">
        {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}

        <h1 className="relative inline-block">
          <span className={full ? "text-display-hero font-myroge" : "text-display-lg"}>
            {titleTop}
            {titleBottom && (
              <>
                <br />
                {titleBottom}
              </>
            )}
          </span>
          {accent && (
            <span
              aria-hidden
              className="script pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 text-script-md whitespace-nowrap text-mauve md:-bottom-8"
            >
              {accent}
            </span>
          )}
        </h1>

        {subtitle && <p className="eyebrow mt-14">{subtitle}</p>}
      </div>
    </section>
  );
}
