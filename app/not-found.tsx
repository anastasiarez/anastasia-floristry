import Link from "next/link";
import { Section } from "@/components/Section";
import { nav } from "@/content/site";

export const metadata = {
  title: "Page not found",
  // A 404 should never be indexed or appear in an AI answer.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section width="content" className="min-h-[60svh]">
      <div className="text-center">
        <p className="script text-script-lg text-mauve">oh dear</p>
        <h1 className="mt-6 text-display-xs">This page has wandered off</h1>
        <p className="mt-8">
          The link may be out of date, or the page may have moved. Here is
          everything else:
        </p>

        <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="eyebrow link-underline text-evergreen">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
