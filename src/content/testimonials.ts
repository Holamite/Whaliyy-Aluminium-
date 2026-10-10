/**
 * Real, approved client feedback only.
 *
 * Add an entry here once the client has agreed to have their words published.
 * Include `rating` only if the client actually gave one.
 *
 * While this list is empty:
 *  - in development (`npm run dev`) the section shows clearly labelled
 *    placeholder cards so the layout can be reviewed;
 *  - in production the section shows an invitation to share feedback instead.
 */

export type Testimonial = {
  name: string;
  quote: string;
  projectType?: string;
  /** Optional approved photo in /public/images/testimonials/ */
  photo?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
};

export const testimonials: Testimonial[] = [];

/** Development-only layout placeholders. Never rendered in production builds. */
export const placeholderTestimonials: Testimonial[] = [
  {
    name: "Placeholder — client name",
    quote: "Placeholder text. Replace with a real client's approved feedback about their project before launch.",
    projectType: "Project type",
  },
  {
    name: "Placeholder — client name",
    quote: "Placeholder text. Replace with a real client's approved feedback about their project before launch.",
    projectType: "Project type",
  },
  {
    name: "Placeholder — client name",
    quote: "Placeholder text. Replace with a real client's approved feedback about their project before launch.",
    projectType: "Project type",
  },
];
