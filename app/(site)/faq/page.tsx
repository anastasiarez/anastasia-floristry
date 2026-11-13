import type { Metadata } from "next";
import { Section, SectionIntro } from "@/components/Section";
import { CTABand } from "@/components/CTABand";
import { faqs } from "@/content/faq";
import { seo } from "@/content/seo";
import { faqPage, home } from "@/content/pages";

export const metadata: Metadata = {
  title: seo.faq.title,
  description: seo.faq.description,
  alternates: { canonical: "/faq" },
};

/**
 * FAQPage structured data.
 *
 * This is what puts answers into Google's answer boxes and makes the page
 * quotable by AI assistants. The schema must contain the same text the user
 * sees, so it is generated from the same source as the visible list.
 */
function FaqSchema() {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function FaqPage() {
  return (
    <>
      <Section width="content">
        <SectionIntro
          as="h1"
          eyebrow={faqPage.eyebrow}
          accent={faqPage.accent}
          title={faqPage.title}
          body={faqPage.body}
        />

        {/* Plain dl rather than accordions: every answer is in the initial
            HTML with no interaction needed, which is what crawlers and AI
            assistants read. */}
        <dl className="mt-20 space-y-14">
          {faqs.map((f) => (
            <div key={f.question}>
              <dt className="text-display-2xs tracking-[0.1em]">{f.question}</dt>
              <dd className="mt-5">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <CTABand {...home.cta} />
      <FaqSchema />
    </>
  );
}
