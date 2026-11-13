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
    <section className="relative isolate flex min-h-svh flex-col items-center justify-start gap-8 bg-wisteria px-(--spacing-gutter) pt-8 pb-8 text-center text-black">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ANA_1992.JPG-ZzlR6KnLiGixe60Pa96zOAuYgUK2uY.jpeg"
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover object-[50%_56%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linen/80" />
      <a
        href={site.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Anastasia Floristry on Instagram"
        className="block w-full max-w-[min(38rem,88vw)] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <Image
          src="/images/anastasia-floristry-evergreen-logo.png"
          alt="Anastasia Floristry — Weddings & Events"
          width={2490}
          height={1000}
          priority
          unoptimized
          className="h-auto w-full brightness-0"
        />
      </a>
      <h1 className="flex flex-col font-myroge text-[clamp(1.5rem,3.3vw,3.25rem)] font-bold normal-case leading-[1.12] text-black">
        <span>We are reimagining</span>
        <span>our website.</span>
      </h1>
      <p className="text-body-sm font-semibold tracking-[0.08em] text-black">
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
