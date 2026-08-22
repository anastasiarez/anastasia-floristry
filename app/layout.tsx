import type { Metadata } from "next";
import { Jost, Parisienne, Poppins } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";
import "./globals.css";

/* ---------------------------------------------------------------------------
   FONTS
   `display` and `script` are free stand-ins for the reference design's two
   commercial fonts. To move to licensed fonts, replace these two
   declarations with next/font/local and point at the woff2 files. Nothing
   else in the codebase needs to change, the CSS variables below are what
   globals.css consumes.
   --------------------------------------------------------------------------- */

const display = Jost({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-jost",
  display: "swap",
});

const script = Parisienne({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-parisienne",
  display: "swap",
});

const body = Poppins({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: `${site.tagline} in ${site.location.city}, ${site.location.region}. ${site.location.serviceArea}.`,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_CA",
  },
  /**
   * Driven by `site.indexable`. While false this serves `noindex, nofollow`
   * on every page (child routes inherit, since none override `robots`).
   *
   * Note we deliberately do NOT also add `Disallow` to robots.txt: blocking
   * the crawl would stop Google from ever reading this noindex, which is how
   * pages end up stuck in the index. Allow the crawl, refuse the indexing.
   */
  robots: site.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  alternates: { canonical: "/" },
};

/**
 * LocalBusiness structured data. Google uses this for the knowledge panel
 * and local results, which is the highest-value SEO win for a business
 * that serves one region.
 */
function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: site.name,
    description: site.tagline,
    url: site.url,
    email: site.contact.email,
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressRegion: site.location.regionCode,
      addressCountry: site.location.countryCode,
    },
    areaServed: site.location.serviceArea,
    ...(site.social.instagram ? { sameAs: [site.social.instagram] } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${display.variable} ${script.variable} ${body.variable}`}>
      <body>
        <a
          href="#main"
          className="eyebrow sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:bg-cream focus:px-5 focus:py-3"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <StructuredData />
      </body>
    </html>
  );
}
