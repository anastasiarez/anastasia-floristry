/**
 * FREQUENTLY ASKED QUESTIONS
 *
 * The highest-leverage page for both Google's answer boxes and AI assistants,
 * because question-plus-short-factual-answer is exactly the format they
 * extract.
 *
 * Rules:
 *  - Answer in the FIRST sentence. No warm-up.
 *  - Each answer must stand alone; it gets quoted without the question.
 *  - Concrete specifics only. "We book up early" is useless.
 *    "Most couples book 9 to 12 months ahead" gets cited.
 *
 * DRAFT: three questions were removed because their answers needed a fact
 * nobody has confirmed yet: booking lead times, the total wedding count, and
 * what happens to arrangements after an event. Add them back once she supplies
 * the numbers. Inventing them would put a falsehood in front of a real client,
 * and this page is the one search engines and assistants quote from.
 */

import { site } from "./site";
import { pricing } from "./services";

export type FAQ = { question: string; answer: string };

const towns = site.location.towns.join(", ");

export const faqs: FAQ[] = [
  {
    question: "What areas do you serve?",
    answer: `We serve Southwestern Ontario, including ${towns}. ` +
      "Weddings further afield are possible and quoted with travel included.",
  },
  {
    question: "How much do wedding flowers cost?",
    answer: `${pricing.note} ` +
      pricing.tiers.map((t) => `${t.guests}, ${t.range}`).join("; ") +
      `. Every wedding is quoted individually, because the ceremony installation and the number of tables affect the figure more than guest count alone.`,
  },
  {
    question: "Do you have a minimum spend?",
    answer: `Full-service wedding florals start at $5,000.`,
  },
  {
    question: "What is the difference between your two packages?",
    answer: `Signature Weddings is the full floral experience: ceremony, cocktail hour, reception and all personal flowers. Intimate Celebrations is built for smaller guest lists and covers refined table arrangements plus one statement ceremony installation.`,
  },
  {
    question: "What is included in full-service wedding florals?",
    answer: `Ceremony florals and installations, cocktail hour arrangements, reception tables and statement pieces, and all personal flowers including bouquets, boutonnieres and corsages. Delivery, on-site setup and end-of-night teardown are included.`,
  },
  {
    question: "Can I choose specific flowers?",
    answer: `Yes, though availability depends on the season and that week's market. We design around what is genuinely at its best on your date, and will say honestly if a flower you want will not look its best then, with close alternatives suggested.`,
  },
  {
    question: "What flowers are in season in Ontario for a wedding?",
    answer: `Ontario's field season runs roughly May through October. Spring brings tulips, daffodils, ranunculus and lilac, with peonies from late May into June. Summer brings garden roses, sweet peas, dahlias and zinnias. Late summer and autumn are strongest for dahlias, chrysanthemums, amaranth and celosia. Outside that window we source from importers.`,
  },
  {
    question: "How do I book?",
    answer: `Send an enquiry with your date, venue and a rough guest count. We reply within two business days to arrange a call, then send a written floral proposal. A signed agreement and deposit hold your date.`,
  },
];
