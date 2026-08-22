import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionIntro } from "@/components/Section";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { CTABand } from "@/components/CTABand";
import { portfolioPage, home } from "@/content/pages";
import { galleries } from "@/content/portfolio";
import { testimonials } from "@/content/testimonials";
import { seo } from "@/content/seo";

export const metadata: Metadata = {
  title: "Portfolio",
  description: seo.portfolio.description,
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <Hero
        titleTop={portfolioPage.hero.title}
        eyebrow={portfolioPage.hero.eyebrow}
        accent={portfolioPage.hero.accent}
        image={portfolioPage.hero.image}
        imageAlt={portfolioPage.hero.imageAlt}
      />

      <Section width="content">
        <SectionIntro body={portfolioPage.intro.body} />
      </Section>

      {/* One banded section per gallery, alternating tone. */}
      {galleries.map((gallery, i) => (
        <Section key={gallery.slug} tone={i % 2 === 0 ? "cream" : "linen"} id={gallery.slug}>
          <div className="mb-12 text-center">
            <h2 className="text-display-2xs tracking-[0.12em]">{gallery.title}</h2>
            <p className="eyebrow mt-4 text-accent">{gallery.caption}</p>
          </div>
          <Gallery images={gallery.images} />
        </Section>
      ))}

      <Testimonials items={testimonials} />

      <CTABand {...home.cta} />
    </>
  );
}
