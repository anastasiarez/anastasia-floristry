import Image from "next/image";
import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "We are reimagining our website",
  description: "Anastasia Floristry is reimagining its website. Please find us on Instagram.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-10 bg-wisteria px-(--spacing-gutter) py-8 text-center text-ink">
      <a
        href={site.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Anastasia Floristry on Instagram"
        className="block w-full max-w-[min(48rem,90vw)] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <Image
          src="/images/98140468-replacement-image-1.png"
          alt="Anastasia Floristry — Weddings & Events"
          width={2490}
          height={1000}
          priority
          unoptimized
          className="h-auto w-full mix-blend-difference"
        />
      </a>
      <h1 className="flex flex-col font-myroge text-[clamp(2rem,5.2vw,4.1rem)] normal-case leading-[1.08]">
        <span>We are reimagining</span>
        <span>our website.</span>
      </h1>
      <p className="text-body-sm tracking-[0.08em]">
        Please find us on{" "}
        <a
          href={site.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          Instagram
        </a>
        .
      </p>
    </section>
  );
}
