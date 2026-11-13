/**
 * SERVICES
 *
 * Based on her actual offering from floweryoursoul.ca: two packages, not a
 * generic three. The layouts adapt to any count, so do not invent a third
 * service to fill space.
 *
 * Descriptive copy below is placeholder written around real facts. The facts
 * (what is included, guest-count bands) are hers and are accurate. The prose
 * should be rewritten in her own voice.
 */

export type Service = {
  slug: string;
  name: string;
  summary: string;
  body: string;
  includes: string[];
  image: string;
  imageAlt: string;
};

export const services: Service[] = [
  {
    slug: "signature-weddings",
    name: "Signature Weddings",
    summary: "Full-service floral design across every part of the day.",
    body: `The complete floral experience, covering the ceremony, cocktail hour, reception and all personal flowers. We design around your venue, your season and your guest count, then handle every part of the day so nothing is left for you to think about.`,
    includes: [
      "Ceremony florals and installations",
      "Cocktail hour arrangements",
      "Reception tables and statement pieces",
      "Personal flowers: bouquets, boutonnieres, corsages",
      "Delivery, setup and end-of-night teardown",
    ],
    image: "/images/services/signature-weddings.jpg",
    imageAlt: "Floral arrangement by Anastasia Floristry",
  },
  {
    slug: "intimate-celebrations",
    name: "Intimate Celebrations",
    summary: "Refined table florals with one statement ceremony installation.",
    body: `For smaller guest lists that still deserve a real floral moment. Considered arrangements across the tables, plus a single statement installation for the ceremony, so the day has one unmistakable focal point without the scale of a full wedding package.`,
    includes: [
      "Statement ceremony installation",
      "Refined table arrangements",
      "Personal flowers",
      "Delivery, setup and teardown",
    ],
    image: "/images/services/intimate-celebrations.jpg",
    imageAlt: "Floral arrangement by Anastasia Floristry",
  },
];

/** The booking process, shown as numbered steps on /services. */
export const process = [
  {
    step: "01",
    title: "Tell us about the day",
    body: `Send through your date, venue and a rough guest count, along with anything you have already collected for inspiration.`,
  },
  {
    step: "02",
    title: "A conversation",
    body: `We talk through the whole picture, what is possible in your season, and where the budget is best spent.`,
  },
  {
    step: "03",
    title: "Proposal and booking",
    body: `You receive a written floral proposal. Once it feels right, a signed agreement and deposit hold your date.`,
  },
];

/**
 * Real investment bands from her existing site. These are genuine numbers and
 * are the single most useful thing on the site for filtering enquiries, so do
 * not soften or remove them.
 */
export const pricing = {
  /** The lowest price for a full-service wedding. Shown on home, services and FAQ. */
  minimum: "$5,000",
  note: "Full-service wedding florals, scaled to guest count.",
  tiers: [
    { guests: "70–80 guests", range: "$5,000 – $6,500" },
    { guests: "80–100 guests", range: "$6,500 – $7,500" },
    { guests: "100–125 guests", range: "$7,500 – $9,500+" },
  ],
};
