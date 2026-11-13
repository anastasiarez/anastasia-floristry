import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionIntro } from "@/components/Section";
import { SplitFeature } from "@/components/SplitFeature";
import { ImageBand } from "@/components/ImageBand";
import { NumberedCards } from "@/components/NumberedCards";
import { CTABand } from "@/components/CTABand";
import { about, home } from "@/content/pages";
import { seo } from "@/content/seo";

export const metadata: Metadata = {
  title: "About",
  description: seo.about.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Hero
        titleTop={about.hero.title}
        eyebrow={about.hero.eyebrow}
        accent={about.hero.accent}
        image={about.hero.image}
        imageAlt={about.hero.imageAlt}
      />

      <SplitFeature
        eyebrow={about.bio.eyebrow}
        title={about.bio.name}
        body={about.bio.body}
        image={about.bio.image}
        imageAlt={about.bio.imageAlt}
        cta={about.bio.cta}
        side="left"
        tone="linen"
      />

      <Section width="content">
        <SectionIntro title={about.intro.title} body={about.intro.body} />
      </Section>

      <ImageBand {...about.band} height="sm" />

      <Section>
        <SectionIntro eyebrow={about.values.eyebrow} title={about.values.title} />
        <div className="mt-20">
          <NumberedCards numbered={false} items={about.values.items} />
        </div>
      </Section>

      <CTABand {...home.cta} />
    </>
  );
}
