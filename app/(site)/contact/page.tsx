import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionIntro } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";
import { contactPage } from "@/content/pages";
import { site } from "@/content/site";
import { seo } from "@/content/seo";

export const metadata: Metadata = {
  title: seo.contact.title,
  description: seo.contact.description,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Section width="content">
        <SectionIntro
          as="h1"
          eyebrow={contactPage.heading.eyebrow}
          title={contactPage.heading.title}
          body={contactPage.intro.body}
        />

        <div className="mt-16">
          <ContactForm />
        </div>

        <p className="mt-16 text-center text-body-sm">
          {contactPage.emailLead}{" "}
          <a href={`mailto:${site.contact.email}`} className="link-underline text-evergreen">
            {site.contact.email}
          </a>
        </p>
      </Section>
    </>
  );
}
