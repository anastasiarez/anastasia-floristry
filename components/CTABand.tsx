import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

/** Closing call to action over a full-bleed image. Appears on every page. */
export function CTABand({
  accent,
  title,
  body,
  button,
  image,
  imageAlt,
}: {
  accent?: string;
  title: string;
  body?: string;
  button: { label: string; href: string };
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="relative flex min-h-[70svh] items-center justify-center overflow-hidden">
      <Image src={image} alt={imageAlt} fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="scrim absolute inset-0" />

      <Reveal className="on-dark relative max-w-(--container-content) px-(--spacing-gutter) text-center text-linen">
        {accent && <p className="script text-script-sm">{accent}</p>}
        <h2 className="mt-6 text-display-sm">{title}</h2>
        {body && <p className="mx-auto mt-8 max-w-xl">{body}</p>}
        <Link
          href={button.href}
          className="eyebrow btn btn-light mt-12"
        >
          {button.label}
        </Link>
      </Reveal>
    </section>
  );
}
