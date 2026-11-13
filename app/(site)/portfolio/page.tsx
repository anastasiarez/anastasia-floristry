import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Section, SectionIntro } from "@/components/Section";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { CTABand } from "@/components/CTABand";
import { portfolioPage, home } from "@/content/pages";
import { galleries, galleryCells } from "@/content/portfolio";
import { testimonials } from "@/content/testimonials";
import { seo } from "@/content/seo";

export const metadata: Metadata = {
  title: seo.portfolio.title,
  description: seo.portfolio.description,
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <Hero
        titleTop={portfolioPage.hero.title}
        eyebrow={portfolioPage.hero.eyebrow}
        image={portfolioPage.hero.image}
        imageAlt={portfolioPage.hero.imageAlt}
      />

      <Section width="content" compact>
        <SectionIntro body={portfolioPage.intro.body} />
      </Section>

      {/* One banded section per gallery, alternating tone. */}
      {galleries.map((gallery, i) => (
        <Section key={gallery.slug} tone={i % 2 === 0 ? "sandstone" : "linen"} id={gallery.slug}>
          <div className="mb-16 text-center">
            <h2 className="text-display-2xs tracking-heading">{gallery.title}</h2>
            <p className="eyebrow mt-4 text-evergreen">{gallery.caption}</p>
          </div>
          <Gallery images={galleryCells(gallery.images)} />
          <div className="mt-10 text-center">
            <Link href="/contact" className="eyebrow link-underline text-evergreen">
              {portfolioPage.galleryEnquire}
            </Link>
          </div>
        </Section>
      ))}

      <Testimonials items={testimonials} />

      <CTABand {...home.cta} />
    </>
  );
}
