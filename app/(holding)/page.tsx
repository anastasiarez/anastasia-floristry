import Image from "next/image";
import type { Metadata } from "next";
import { site } from "@/content/site";
import { holding } from "@/content/pages";

export const metadata: Metadata = {
  title: holding.metaTitle,
  description: holding.metaDescription,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <section className="relative isolate flex min-h-svh flex-col items-center justify-start gap-8 bg-wisteria px-(--spacing-gutter) pt-8 pb-8 text-center text-black">
      <Image
        src="/images/holding/hero.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover object-[50%_56%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linen/35" />
      <div aria-hidden="true" className="veil absolute inset-0 -z-10" />
      <a
        href={site.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={holding.logoLinkLabel}
        className="block w-full max-w-[min(38rem,88vw)] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <Image
          src="/images/anastasia-floristry-evergreen-logo.png"
          alt={holding.logoAlt}
          width={3000}
          height={1204}
          sizes="(min-width: 44rem) 38rem, 88vw"
          preload
          className="h-auto w-full brightness-0"
        />
      </a>
      <h1 className="flex flex-col font-myroge text-holding font-bold normal-case leading-[1.12] text-black">
        {holding.heading.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      <p className="text-body-sm font-semibold tracking-[0.08em] text-black">
        {holding.instagramLead}{" "}
        <a
          href={site.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          {holding.instagramLink}
        </a>
        .
      </p>
    </section>
  );
}
