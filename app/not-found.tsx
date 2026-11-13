import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Section, SectionIntro } from "@/components/Section";
import { notFoundPage } from "@/content/pages";
import { nav } from "@/content/site";

export const metadata = {
  title: notFoundPage.metaTitle,
  // A 404 should never be indexed or appear in an AI answer.
  robots: { index: false, follow: true },
};

/**
 * Rendered by the root layout, outside the (site) group, so it brings its own
 * header and footer: a lost visitor should still see the whole site frame.
 */
export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main">
        <Section width="content" className="min-h-[60svh]">
          <SectionIntro
            as="h1"
            eyebrow={notFoundPage.eyebrow}
            title={notFoundPage.title}
            body={notFoundPage.body}
          />
          <ul className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="eyebrow link-underline text-evergreen">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <Footer />
    </>
  );
}
