import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionIntro } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { contactPage } from "@/content/pages";
import { site } from "@/content/site";
import { seo } from "@/content/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: seo.contact.description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Hero
        titleTop={contactPage.hero.title}
        eyebrow={contactPage.hero.eyebrow}
        accent={contactPage.hero.accent}
        image={contactPage.hero.image}
        imageAlt={contactPage.hero.imageAlt}
      />

      <Section width="content">
        <SectionIntro body={contactPage.intro.body} />

        <div className="mt-20">
          <ContactForm />
        </div>

        <p className="mt-16 text-center text-body-sm">
          Prefer email?{" "}
          <a href={`mailto:${site.contact.email}`} className="link-underline text-accent">
            {site.contact.email}
          </a>
        </p>
      </Section>
    </>
  );
}
