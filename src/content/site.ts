/**
 * Central business details. Every component reads from here, so phone numbers,
 * the address and the WhatsApp number only ever need changing in this file.
 * Details below are taken from the business card supplied by the client.
 */

export const business = {
  name: "Whaliyy Aluminium Concept",
  shortName: "Whaliyy",
  tagline: "Diligently Redefined Your Luxury",
  registrationNumber: "BN3587993",
  ceo: "Adeyemo Abiodun Waliu",
  description:
    "Aluminium fabrication and architectural glass installations for homes, offices and commercial buildings in Lagos.",
  address: {
    street: "198, Ikotun–Idimu Road",
    landmark: "Calvary Bus Stop",
    area: "Idimu",
    city: "Lagos",
    country: "Nigeria",
    countryCode: "NG",
  },
  phones: [
    { display: "0813 405 4905", tel: "+2348134054905" },
    { display: "0915 856 2764", tel: "+2349158562764" },
  ],
  /**
   * WhatsApp number in international format, no "+" or spaces.
   * Confirmed by the client as the WhatsApp line: https://wa.me/2349158562764
   */
  whatsapp: "2349158562764",
  /** Social accounts: add only verified URLs supplied by the business. */
  social: [] as { label: string; href: string }[],
} as const;

export const fullAddress = `${business.address.street}, ${business.address.landmark}, ${business.address.area}, ${business.address.city}, ${business.address.country}`;

/** Map link uses an address search, not guessed coordinates. Confirm the pin before launch. */
export const mapQuery = encodeURIComponent(
  "198 Ikotun-Idimu Road, Calvary Bus Stop, Idimu, Lagos, Nigeria",
);
export const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
export const mapEmbed = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

/**
 * Public site URL. Set NEXT_PUBLIC_SITE_URL once the domain is known;
 * it drives canonical URLs, the sitemap and Open Graph tags.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const navigation = [
  { label: "Home", href: "/#top" },
  { label: "About Us", href: "/#about" },
  { label: "Our Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
] as const;
