import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section, SectionIntro } from "@/components/Section";
import { SplitFeature } from "@/components/SplitFeature";
import { ImageBand } from "@/components/ImageBand";
import Image from "next/image";
import { Testimonials } from "@/components/Testimonials";
import { CTABand } from "@/components/CTABand";
import { Gallery } from "@/components/Gallery";
import { home } from "@/content/pages";
import { pricing, services } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { galleries, galleryCells } from "@/content/portfolio";
import { seo } from "@/content/seo";

export const metadata: Metadata = {
  description: seo.home.description,
  alternates: { canonical: "/" },
};

/** Covers of the featured galleries, used for the home page preview grid. */
const featured = galleries
  .filter((g) => g.featured)
  .flatMap((g) => galleryCells(g.images).slice(0, 2));

export default function HomePage() {
  return (
    <>
      <Hero {...home.hero} full />

      <Section width="content">
        <SectionIntro {...home.intro} />
      </Section>

      {featured.length > 0 && (
        <Section tone="sandstone">
          <SectionIntro eyebrow={home.featured.eyebrow} title={home.featured.title} />
          <div className="mt-16">
            <Gallery images={featured} />
          </div>
          <div className="mt-10 text-center">
            <Link href="/portfolio" className="eyebrow link-underline text-evergreen">
              {home.featured.link}
            </Link>
          </div>
        </Section>
      )}

      <SplitFeature {...home.approach} side="left" />

      <ImageBand {...home.band} />

      <Section tone="sandstone">
        <SectionIntro eyebrow={home.services.eyebrow} title={home.services.title} />
        <div className="mt-16">
          {/* One card per package, each with its photo, linking to its
              section on /services. Mirrors the packages, so any count works. */}
          <ul className="grid gap-12 md:grid-cols-2 md:gap-10">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className="group block">
                  <div className="relative aspect-4/5 overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.imageAlt}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-8 text-display-2xs tracking-heading">{s.name}</h3>
                  <p className="mt-5 text-body-sm">{s.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-16 text-center">
          <p className="text-display-2xs">
            {home.services.fromPrice} {pricing.minimum}
          </p>
          <Link href="/services#pricing" className="eyebrow link-underline mt-10 inline-block text-evergreen">
            {home.services.link}
          </Link>
        </div>
      </Section>

      <Testimonials items={testimonials} tone="linen" />

      <CTABand {...home.cta} />
    </>
  );
}
