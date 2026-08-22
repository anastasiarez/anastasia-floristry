/**
 * SITE CONFIGURATION
 *
 * Single source of truth for business details, navigation and SEO defaults.
 * Everything marked TODO is placeholder and needs the real value before launch.
 */

/** Shape of the site config. Explicitly typed so optional empty strings stay
 *  `string` rather than narrowing to the literal `""`. */
type Site = {
  name: string;
  tagline: string;
  url: string;
  location: {
    city: string;
    region: string;
    regionCode: string;
    country: string;
    countryCode: string;
    serviceArea: string;
    towns: readonly string[];
  };
  contact: {
    email: string;
    /** Empty string hides the phone number everywhere. */
    phone: string;
    inquiryInbox: string;
  };
  social: {
    /** Empty string hides the link. */
    instagram: string;
    pinterest: string;
  };
  founded: number;
  indexable: boolean;
};

export const site: Site = {
  /** Business name. Appears in the nav, footer, page titles and structured data. */
  name: "Anastasia Floristry",
  /** Short tagline. Used as the default meta description prefix. */
  tagline: "Wedding and event florals",
  /**
   * NOTE ON BRANDING: the previous business was "Flower Your Soul"
   * (floweryoursoul.ca, @flower_your_soul). The new domain is
   * anastasiafloristry.com, so this is treated as a rebrand. If she is
   * keeping the old name instead, change `name` above and nothing else
   * needs touching.
   */
  /** Production URL. Required for canonical links, sitemap and Open Graph. */
  url: "https://anastasiafloristry.com",

  /** Where she works. Drives the service-area structured data. */
  location: {
    city: "Brantford", // TODO confirm her home base; the service list centres on Brant
    region: "Ontario",
    regionCode: "ON",
    country: "Canada",
    countryCode: "CA",
    /** Free-text service area shown in the footer. */
    serviceArea: `Hamilton, Brantford, Cambridge, Kitchener, Waterloo, Guelph and surrounding Southwestern Ontario`,
    /** Named towns, used for local SEO and the FAQ. Order roughly by volume. */
    towns: [
      "Hamilton",
      "Brantford",
      "Brant",
      "Cambridge",
      "Kitchener",
      "Waterloo",
      "Guelph",
      "Elora",
      "Elmira",
      "Burlington",
      "Oakville",
    ],
  },

  contact: {
    // Previous public address was floweryoursoul@gmail.com. A branded address
    // on the new domain looks more established and is worth setting up.
    email: "hello@anastasiafloristry.com", // TODO confirm, or revert to the gmail
    phone: "", // TODO optional, leave empty to hide
    /** Where inquiry emails from the contact form are delivered. */
    inquiryInbox: "floweryoursoul@gmail.com", // her existing working inbox
  },

  social: {
    instagram: "https://instagram.com/flower_your_soul", // TODO update if the handle changes with the rebrand
    pinterest: "", // leave empty to hide
  },

  /** Founding year, used for the footer copyright range. */
  founded: 2019, // 5+ years of experience as of her old site

  /**
   * PRE-LAUNCH INDEXING SWITCH.
   *
   * false  -> every page serves `noindex, nofollow`, and llms.txt/sitemap.xml
   *           carry an X-Robots-Tag: noindex header.
   * true   -> normal indexing, and robots.txt restores the explicit
   *           AI-crawler allowlist (GPTBot, ClaudeBot, PerplexityBot, ...).
   *
   * Currently false because the site is publicly reachable while still
   * showing placeholder copy, "TODO" alt text, and a visual identity that the
   * brand designer is about to replace. There is no upside to being indexed
   * in that state, and search engines' first impression is sticky.
   *
   * FLIP THIS TO true AT LAUNCH. It is the only change required.
   * Tracked in TODO.md.
   */
  indexable: false,
};

/**
 * Header navigation. Order here is the order rendered.
 *
 * Kept deliberately short: the studio name is long, and the desktop nav
 * splits around it. Secondary pages go in `routes` and the footer instead.
 */
export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Every indexable page. Drives the sitemap and llms.txt.
 *
 * This is a superset of `nav`: pages that should be found by search engines
 * but do not need a header link belong here only. Add new pages here or they
 * will never be crawled.
 */
export const routes = [
  { href: "/", label: "Home", priority: 1.0 },
  { href: "/about", label: "About", priority: 0.8 },
  { href: "/services", label: "Services", priority: 0.9 },
  { href: "/portfolio", label: "Portfolio", priority: 0.8 },
  { href: "/faq", label: "Questions", priority: 0.7 },
  { href: "/contact", label: "Contact", priority: 0.8 },
] as const;
