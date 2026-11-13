import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionIntro } from "@/components/Section";
import { SplitFeature } from "@/components/SplitFeature";
import { ImageBand } from "@/components/ImageBand";
import { NumberedCards } from "@/components/NumberedCards";
import { Testimonials } from "@/components/Testimonials";
import { CTABand } from "@/components/CTABand";
import { servicesPage, home } from "@/content/pages";
import { services, process } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { seo } from "@/content/seo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description: seo.services.description,
  alternates: { canonical: "/services" },
};

/**
 * Service structured data, one entry per offering.
 *
 * Lets search engines and AI assistants answer "does X do elopements" or
 * "who does wedding florals near Guelph" with this business as the
 * source, rather than only matching on the page text.
 */
function ServicesSchema() {
  const json = services.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.summary,
    serviceType: s.name,
    areaServed: site.location.serviceArea,
    provider: {
      "@type": "Florist",
      name: site.name,
      url: site.url,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.location.city,
        addressRegion: site.location.regionCode,
        addressCountry: site.location.countryCode,
      },
    },
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function ServicesPage() {
  return (
    <>
      <Hero
        titleTop={servicesPage.hero.title}
        eyebrow={servicesPage.hero.eyebrow}
        accent={servicesPage.hero.accent}
        subtitle={servicesPage.hero.subtitle}
        image={servicesPage.hero.image}
        imageAlt={servicesPage.hero.imageAlt}
      />

      <Section width="content">
        <SectionIntro body={servicesPage.intro.body} />
      </Section>

      {/* One detail block per service, alternating sides. */}
      {services.map((service, i) => (
        <SplitFeature
          key={service.slug}
          id={service.slug}
          eyebrow={`0${i + 1}`}
          title={service.name}
          body={service.body}
          bullets={service.includes}
          image={service.image}
          imageAlt={service.imageAlt}
          side={i % 2 === 0 ? "left" : "right"}
          tone={i % 2 === 0 ? "cream" : "linen"}
        />
      ))}

      <ImageBand {...servicesPage.band} height="sm" />

      <Section>
        <SectionIntro eyebrow="The process" title="How it works" />
        <div className="mt-20">
          <NumberedCards items={process} />
        </div>
      </Section>

      <Testimonials items={testimonials} />

      <CTABand {...home.cta} />
      <ServicesSchema />
    </>
  );
}
