import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "We are reimagining our website",
  description: "Anastasia Floristry is reimagining its website. Wedding and event florals in Ontario.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <section className="flex min-h-[75svh] items-center justify-center bg-sandstone px-(--spacing-gutter) py-24 text-center">
      <h1 className="max-w-5xl font-myroge text-display-xl normal-case leading-[1.15] text-linen">
        We are reimagining our website
      </h1>
    </section>
  );
}
