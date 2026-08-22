import type { Metadata } from "next";
import { Montserrat, Prata } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageFade } from "@/components/PageFade";
import { site } from "@/content/site";
import "./globals.css";

/* ---------------------------------------------------------------------------
   FONTS

   Both are the free substitutes the brand guidelines explicitly sanction:

     Myroge      (display serif)  -> Prata
     Sweet Sans  (eyebrow/subhead) -> Montserrat
     Montserrat Light (body)       -> Montserrat 300

   Prata ships a single 400 weight, which is correct: the spec calls for
   regular spacing at large sizes, not a light cut.

   The reference design's script face is gone. The brand's script
   (OPTIExcelsior) is licensed for the logo only, and the guidelines specify no
   web script role, so decorative accents use the display serif instead.
   --------------------------------------------------------------------------- */

const display = Prata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-prata",
  display: "swap",
});

const body = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-montserrat",
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
    <html
      lang="en-CA"
      className={`${display.variable} ${body.variable}`}
      // The inline script below adds `js-reveal` to this element before React
      // hydrates, so the client class list legitimately differs from the
      // server's. Same reason next-themes suppresses here.
      suppressHydrationWarning
    >
      <head>
        {/*
          Arms the scroll-reveal hidden state before first paint. Kept inline
          and synchronous on purpose: a deferred script would let content paint
          visible and then jump to hidden. Without JS the class never lands and
          everything renders visible, which is the safe failure.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-reveal')`,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="eyebrow sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:bg-linen focus:px-5 focus:py-3"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">
          <PageFade>{children}</PageFade>
        </main>
        <Footer />
        <StructuredData />
        {/*
          Vercel Analytics. Cookieless and with no persistent identifier, which
          is why it was chosen over Google Analytics: no consent banner is
          required, and the privacy policy stays simple.

          Collection only happens on Vercel deployments, and must also be
          enabled in the project's Analytics tab. The package alone does
          nothing.
        */}
        <Analytics />
      </body>
    </html>
  );
}
