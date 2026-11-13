import Link from "next/link";
import SiteLayout from "./(site)/layout";
import { Section, SectionIntro } from "@/components/Section";
import { notFoundPage } from "@/content/pages";
import { nav } from "@/content/site";

export const metadata = {
  title: notFoundPage.metaTitle,
  // A 404 should never be indexed or appear in an AI answer.
  robots: { index: false, follow: true },
};

/**
 * Rendered by the root layout, outside the (site) group, so it wraps itself in
 * that group's layout: a lost visitor still sees the whole site frame.
 */
export default function NotFound() {
  return (
    <SiteLayout>
      <Section width="content" className="min-h-[60svh]">
        <SectionIntro
          as="h1"
          eyebrow={notFoundPage.eyebrow}
          title={notFoundPage.title}
          body={notFoundPage.body}
        />
        <ul className="mx-auto mt-16 grid max-w-md grid-cols-3 justify-items-center gap-y-4">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="eyebrow link-underline text-evergreen">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </SiteLayout>
  );
}
