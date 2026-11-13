import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

/**
 * Image on one side, text on the other. Used for the approach block, the
 * bio, and each service detail on /services.
 */
export function SplitFeature({
  eyebrow,
  title,
  body,
  bullets,
  cta,
  image,
  imageAlt,
  side = "left",
  tone = "linen",
  id,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  bullets?: readonly string[];
  cta?: { label: string; href: string };
  image: string;
  imageAlt: string;
  /** Which side the image sits on at md and up. */
  side?: "left" | "right";
  tone?: "linen" | "sandstone";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`${tone === "sandstone" ? "bg-sandstone" : "bg-linen"} py-(--spacing-section)`}
    >
      <div className="mx-auto grid max-w-(--container-wide) items-center gap-12 px-(--spacing-gutter) md:grid-cols-2 md:gap-20">
        <div
          className={`relative aspect-4/5 w-full ${
            side === "right" ? "md:order-2" : "md:order-1"
          }`}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 82.5rem) 41rem, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <Reveal className={side === "right" ? "md:order-1" : "md:order-2"}>
          {eyebrow && <p className="eyebrow text-evergreen">{eyebrow}</p>}
          <h2 className="mt-6 text-display-xs">{title}</h2>
          <p className="mt-8">{body}</p>

          {bullets && bullets.length > 0 && (
            <ul className="mt-8 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex gap-4 text-body-sm">
                  <span aria-hidden className="mt-3 h-px w-5 shrink-0 bg-mauve" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {cta && (
            <Link href={cta.href} className="eyebrow link-underline mt-10 inline-block text-evergreen">
              {cta.label}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
