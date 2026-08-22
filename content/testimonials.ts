/**
 * TESTIMONIALS
 *
 * Used by the rotating testimonial band. Real quotes only before launch,
 * these are placeholders. Delete any you do not have yet, the component
 * handles any count including one.
 */

export type Testimonial = {
  quote: string;
  /** Client name, or names for a couple. */
  author: string;
  /** Optional context line, e.g. venue or event type. */
  context?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: "TODO real client quote goes here, kept to two lines or so.",
    author: "TODO Client Name",
    context: "TODO venue or event",
  },
  {
    quote: "TODO real client quote goes here.",
    author: "TODO Client Name",
    context: "TODO venue or event",
  },
];
