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

/**
 * DRAFT: empty until real quotes arrive.
 *
 * Deliberately empty rather than populated with invented quotes. A fabricated
 * testimonial on a live site is a lie to a client, and the Testimonials
 * component renders nothing for an empty list, so the band simply does not
 * appear. Add entries as she supplies them, with permission to publish names.
 */
export const testimonials: Testimonial[] = [];
