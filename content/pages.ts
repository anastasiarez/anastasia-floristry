import { pricing, services } from "./services";

/**
 * PAGE COPY
 *
 * Every piece of user-facing text that is not a service, gallery or
 * testimonial. All placeholder, written to the right length per slot.
 */

/** The temporary holding page shown at "/" while the full site is rebuilt. */
export const holding = {
  /** Browser tab title and search snippet for the holding page. */
  metaTitle: `We are reimagining our website`,
  metaDescription: `Anastasia Floristry is reimagining its website. Please find us on Instagram.`,
  /** Two short lines, shown stacked. */
  heading: [`We are reimagining`, `our website.`],
  /** The word "Instagram" after this is the link. */
  instagramLead: `Please find us on`,
  instagramLink: `Instagram`,
  /** Describes the logo image for screen readers. */
  logoAlt: `Anastasia Floristry, Weddings & Events`,
  logoLinkLabel: `Anastasia Floristry on Instagram`,
};

export const home = {
  /** Heading and link around the photo strip of featured work. */
  featured: {
    eyebrow: "Portfolio",
    title: "Recent work",
    link: "See the portfolio",
  },
  services: {
    eyebrow: "Services",
    title: "How we can help",
    /** Followed by the minimum from `pricing` in content/services.ts. */
    fromPrice: "Full-service weddings from",
    link: "Services and pricing",
  },
  hero: {
    /** Split across two lines in the hero. Keep each part short. */
    titleTop: "anastasia",
    titleBottom: "floristry",
    subtitle: "Weddings & Events in Southwestern Ontario",
    image: "/images/home/hero.jpg",
    imageAlt: "Floral arrangement by Anastasia Floristry",
  },
  intro: {
    eyebrow: "Welcome",
    title: "Flowers that belong to the day they were made for",
    body: `Every wedding has a season, a room and a light of its own. We design to those things rather than to a trend, which means the flowers look like they were always meant to be there.`,
  },
  approach: {
    eyebrow: "Our approach",
    title: "Designed around the season, the venue and you",
    body: `We work with what is genuinely at its best on your date, sourced as locally as the season allows. The result is florals that feel abundant and unforced.`,
    cta: { label: "More about us", href: "/about" },
    image: "/images/home/approach.jpg",
    imageAlt: "Floral arrangement by Anastasia Floristry",
  },
  /** Full-width image band between sections. */
  band: {
    image: "/images/home/band.jpg",
    imageAlt: "Floral arrangement by Anastasia Floristry",
  },
  cta: {
    accent: "let's begin",
    title: "Tell us what you are planning",
    body: `Dates book up well ahead, particularly through summer and early autumn. Reach out and we will let you know what is open.`,
    button: { label: "Enquire", href: "/contact" },
    image: "/images/home/cta.jpg",
    imageAlt: "Floral arrangement by Anastasia Floristry",
  },
};

export const about = {
  hero: {
    eyebrow: "About",
    title: "The studio",
    image: "/images/about/hero.jpg",
    imageAlt: "Anastasia Floristry studio",
  },
  intro: {
    eyebrow: "The studio",
    title: "A small studio, deliberately",
    body: `Taking a limited number of weddings each season is a choice, not a limitation. It means the person you speak with is the person designing your flowers and standing in the room on the day.`,
  },
  bio: {
    eyebrow: "Meet the florist",
    name: "Anastasia",
    /**
     * DRAFT built from the real facts on her previous site: she grew up in
     * rural Ukraine surrounded by gardens, left a corporate career for floral
     * design, and has 5+ years and 150+ weddings behind her.
     *
     * She should rewrite this in her own voice. It is the most-read block on
     * the site, and the Ukraine detail is the most distinctive thing about
     * her story, so it should not be buried.
     */
    body: `I grew up in rural Ukraine, in a place where everyone had a garden and flowers were simply part of ordinary life. That stayed with me through years of corporate work, until I finally gave in to it. More than 150 weddings later, I still get the same feeling walking into a room before the guests arrive.`,
    image: "/images/about/portrait.jpg",
    imageAlt: "Anastasia, founder of Anastasia Floristry",
    cta: { label: "See my work", href: "/portfolio" },
  },
  values: {
    eyebrow: "What we care about",
    title: "How we work",
    items: [
      {
        title: "Seasonal first",
        body: `What is in season is what looks best and lasts longest. We build the palette around it.`,
      },
      {
        title: "Sourced close to home",
        body: `Local growers wherever the season allows, with the rest chosen carefully.`,
      },
      {
        title: "Nothing wasted",
        body: `Arrangements are composted or rehomed after the event, and we avoid single-use floral foam.`,
      },
    ],
  },
  band: {
    image: "/images/about/band.jpg",
    imageAlt: "Floral arrangement by Anastasia Floristry",
  },
};

export const servicesPage = {
  hero: {
    eyebrow: "Services",
    title: "What we do",
    subtitle: "Signature weddings and intimate celebrations",
    image: "/images/services/hero.jpg",
    imageAlt: "Floral arrangement by Anastasia Floristry",
  },
  intro: {
    body: `Every enquiry is quoted individually, because the right answer depends on your venue, your season and the scale of the day. Below is the shape of what we offer.`,
    /** Followed by the minimum from `pricing`, linking to the price guide. */
    fromPrice: "Full-service weddings from",
    priceLink: "See the price guide",
  },
  /** Price guide. The figures come from `pricing` in content/services.ts. */
  pricing: {
    eyebrow: "Investment",
    title: "Price guide",
  },
  process: {
    eyebrow: "The process",
    title: "How it works",
  },
  band: {
    image: "/images/services/band.jpg",
    imageAlt: "Floral arrangement by Anastasia Floristry",
  },
};

export const portfolioPage = {
  hero: {
    eyebrow: "Portfolio",
    title: "Recent work",
    image: "/images/portfolio/hero.jpg",
    imageAlt: "Floral arrangement by Anastasia Floristry",
  },
  /** Under each gallery, linking to the enquiry form. */
  galleryEnquire: "Enquire about your date",
  intro: {
    body: `A selection of recent weddings and events. Each one was designed for its own room, season and couple.`,
  },
};

export const contactPage = {
  /** No image hero here: people arrive ready to enquire, so the form comes first. */
  heading: {
    eyebrow: "Contact",
    title: "Get in touch",
  },
  /** Shown under the form, followed by the email address. */
  emailLead: "Prefer email?",
  intro: {
    body: `Fill in as much as you know. Nothing has to be final, a rough date and a venue are enough to start. We reply to every enquiry within two business days.`,
  },
  /**
   * Enquiry form definition.
   *
   * The budget bands and event types are DERIVED from her real packages and
   * price tiers in content/services.ts, never restated. An earlier version
   * hardcoded bands in the component that started at "Under $2,000" while her
   * actual floor is $5,000, which invited enquiries she cannot serve and
   * contradicted the figures published on /services and /faq.
   */
  form: {
    name: { label: "Your name" },
    email: { label: "Email address" },
    eventDate: { label: "Event date", hint: "Approximate is fine" },
    eventType: {
      label: "Type of event",
      options: [...services.map((s) => s.name), "Something else"],
    },
    venue: { label: "Venue or location" },
    budget: {
      label: "Floral budget",
      options: [...pricing.tiers.map((t) => t.range), "Not sure yet"],
    },
    message: { label: "Tell us about the day" },
    placeholder: "Select one",
    submit: "Send enquiry",
    submitting: "Sending…",
    genericError: "Something went wrong.",
  },

  /** Shown after a successful submission. */
  success: {
    title: "Thank you",
    body:
      "Your enquiry has arrived. We will be in touch within two business days.",
  },
};

/** The 404 page. */
export const notFoundPage = {
  metaTitle: "Page not found",
  eyebrow: "Page not found",
  title: "This page has wandered off",
  body: `The link may be out of date, or the page may have moved. Here is everything else:`,
};

export const faqPage = {
  eyebrow: "Good to know",
  title: "Questions",
  body: `Everything couples usually want to know before enquiring. If your question is not here, just ask.`,
};
