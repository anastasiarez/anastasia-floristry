import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section, SectionIntro } from "@/components/Section";
import { SplitFeature } from "@/components/SplitFeature";
import { ImageBand } from "@/components/ImageBand";
import { NumberedCards } from "@/components/NumberedCards";
import { Testimonials } from "@/components/Testimonials";
import { CTABand } from "@/components/CTABand";
import { Gallery } from "@/components/Gallery";
import { home } from "@/content/pages";
import { services } from "@/content/services";
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
        <Section tone="linen">
          <Gallery images={featured} />
        </Section>
      )}

      <SplitFeature {...home.approach} side="left" />

      <ImageBand {...home.band} />

      <Section tone="linen">
        <SectionIntro eyebrow={home.services.eyebrow} title={home.services.title} />
        <div className="mt-20">
          <NumberedCards
            numbered={false}
            items={services.map((s) => ({ title: s.name, body: s.summary }))}
          />
        </div>
        <div className="mt-16 text-center">
          <Link href="/services" className="eyebrow link-underline text-evergreen">
            {home.services.link}
          </Link>
        </div>
      </Section>

      <Testimonials items={testimonials} tone="cream" />

      <CTABand {...home.cta} />
    </>
  );
}
