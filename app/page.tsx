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
        <SectionIntro eyebrow="Services" title="How we can help" />
        <div className="mt-20">
          <NumberedCards
            items={services.map((s, i) => ({
              step: String(i + 1).padStart(2, "0"),
              title: s.name,
              body: s.summary,
            }))}
          />
        </div>
      </Section>

      <Testimonials items={testimonials} tone="cream" />

      <CTABand {...home.cta} />
    </>
  );
}
