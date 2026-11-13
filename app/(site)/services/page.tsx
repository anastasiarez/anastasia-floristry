import type { Metadata } from "next";
import { FromPrice } from "@/components/FromPrice";
import { Hero } from "@/components/Hero";
import { Section, SectionIntro } from "@/components/Section";
import { SplitFeature } from "@/components/SplitFeature";
import { ImageBand } from "@/components/ImageBand";
import { NumberedCards } from "@/components/NumberedCards";
import { Testimonials } from "@/components/Testimonials";
import { CTABand } from "@/components/CTABand";
import { servicesPage, home } from "@/content/pages";
import { pricing, services, process } from "@/content/services";
import { testimonials } from "@/content/testimonials";
import { seo } from "@/content/seo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: seo.services.title,
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
        subtitle={servicesPage.hero.subtitle}
        image={servicesPage.hero.image}
        imageAlt={servicesPage.hero.imageAlt}
      />

      <Section width="content" compact>
        <SectionIntro body={servicesPage.intro.body} />
        <FromPrice href="#pricing" linkLabel={servicesPage.intro.priceLink} />
      </Section>

      {/* One detail block per service, alternating sides. */}
      {services.map((service, i) => (
        <SplitFeature
          key={service.slug}
          id={service.slug}
          title={service.name}
          body={service.body}
          bullets={service.includes}
          image={service.image}
          imageAlt={service.imageAlt}
          side={i % 2 === 0 ? "left" : "right"}
          tone={i % 2 === 0 ? "sandstone" : "linen"}
        />
      ))}

      <Section width="content" id="pricing" tone="sandstone">
        <SectionIntro
          eyebrow={servicesPage.pricing.eyebrow}
          title={servicesPage.pricing.title}
          body={pricing.note}
        />
        <dl className="mt-16 divide-y divide-ink/15 border-y border-ink/15">
          {pricing.tiers.map((tier) => (
            <div
              key={tier.guests}
              className="flex flex-col gap-1 py-6 text-center sm:flex-row sm:items-baseline sm:justify-between sm:text-left"
            >
              <dt className="eyebrow text-evergreen">{tier.guests}</dt>
              <dd className="text-display-2xs">{tier.range}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <ImageBand {...servicesPage.band} height="sm" />

      <Section>
        <SectionIntro eyebrow={servicesPage.process.eyebrow} title={servicesPage.process.title} />
        <div className="mt-16">
          <NumberedCards items={process} />
        </div>
      </Section>

      <Testimonials items={testimonials} />

      <CTABand {...home.cta} />
      <ServicesSchema />
    </>
  );
}
