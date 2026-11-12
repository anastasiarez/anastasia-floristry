import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "We are reimagining our website",
  description: "Anastasia Floristry is reimagining its website. Please find us on Instagram.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-8 bg-sandstone px-(--spacing-gutter) py-24 text-center text-ink">
      <h1 className="max-w-5xl font-myroge text-display-xl normal-case leading-[1.15]">
        We are reimagining our website.
      </h1>
      <p className="text-body-sm tracking-[0.08em]">
        Please find us on{" "}
        <a
          href={site.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 transition-opacity hover:opacity-75 focus-visible:outline-linen"
        >
          Instagram
        </a>
        .
      </p>
    </section>
  );
}
