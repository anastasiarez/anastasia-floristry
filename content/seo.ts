/**
 * PER-PAGE SEO TEXT
 *
 * Deliberately separate from body copy. Meta descriptions have a different
 * job than page copy: they are a 150-character sales pitch in a search
 * result, written to be factual and specific because that is what both
 * Google and AI assistants extract.
 *
 * Rules:
 *  - 70–160 characters. Shorter wastes the snippet, longer gets truncated.
 *  - Lead with what the business is and where it operates.
 *  - State concrete facts. Vague atmospheric writing does not get cited.
 *  - Never reuse the same description on two pages.
 */

export const seo = {
  home: {
    title: undefined, // uses the root template: "<name> — <tagline>"
    description:
      "Wedding and event florist serving Toronto and southern Ontario. Seasonal floral design for weddings, celebrations and large-scale installations.",
  },
  about: {
    title: "About",
    description:
      "Meet the florist behind Anastasia Floristry, a small Ontario studio taking a limited number of weddings each season so every event gets full attention.",
  },
  services: {
    title: "Services",
    description:
      "Wedding florals, event arrangements and large-scale installations in Ontario. Bouquets, ceremony pieces, centrepieces, delivery, setup and teardown.",
  },
  portfolio: {
    title: "Portfolio",
    description:
      "Recent wedding and event florals across Toronto and southern Ontario, each designed around the venue, the season and the couple.",
  },
  contact: {
    title: "Contact",
    description:
      "Enquire about wedding or event florals in Toronto and southern Ontario. Share your date and venue and we reply within two business days.",
  },
  faq: {
    title: "Questions",
    description:
      "Common questions about booking wedding florals in Ontario: lead times, budgets, delivery areas, seasonal availability and what is included.",
  },
} as const;
