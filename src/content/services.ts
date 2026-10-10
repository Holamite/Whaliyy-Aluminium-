import { images, type ImageAsset } from "./images";
import type { ProjectCategoryId } from "./projects";

export type Service = {
  slug: string;
  name: string;
  summary: string;
  /** Real project photo. Omitted when the business has not supplied one yet. */
  image?: ImageAsset;
  imageAlt?: string;
  /** Gallery filter that shows matching work, when photos exist. */
  galleryFilter?: ProjectCategoryId;
};

export const services: Service[] = [
  {
    slug: "aluminium-doors-windows",
    name: "Aluminium Doors & Windows",
    summary:
      "Custom aluminium-framed doors and windows designed to complement modern residential and commercial buildings.",
    image: images.img03,
    imageAlt: "Black-framed aluminium sliding glass doors installed on a building front",
    galleryFilter: "doors-windows",
  },
  {
    slug: "frameless-glass",
    name: "Frameless Glass Installations",
    summary:
      "Minimalist glass solutions that create clean sightlines and an open, contemporary appearance.",
    image: images.img29,
    imageAlt: "Frameless glass staircase balustrade in a bright marble-floored living room",
    galleryFilter: "frameless-glass",
  },
  {
    slug: "curtain-wall",
    name: "Curtain Wall Systems",
    summary: "Modern glass façade solutions for commercial buildings and architectural projects.",
    image: images.img05,
    imageAlt: "Angled glass façade panels set in slim metal frames",
    galleryFilter: "curtain-walls",
  },
  {
    slug: "office-partitioning",
    name: "Office Glass Partitioning",
    summary: "Professional glass partitions that help create bright, elegant and functional workspaces.",
    image: images.img08,
    imageAlt: "Full-height frameless glass partition with a glass door in an open office",
    galleryFilter: "partitions",
  },
  {
    slug: "shower-cubicles",
    name: "Glass Shower Cubicles",
    summary: "Stylish shower enclosures that give bathrooms a clean, contemporary finish.",
    image: images.img22,
    imageAlt: "Clear glass shower enclosure beside a freestanding bathtub in a marble bathroom",
    galleryFilter: "shower-cubicles",
  },
  {
    slug: "swing-glass-doors",
    name: "Swing Glass Doors",
    summary: "Elegant glass door installations for offices, homes, shops and commercial spaces.",
    image: images.img04,
    imageAlt: "Tinted frameless double swing glass doors with gold handles and patch fittings",
    galleryFilter: "frameless-glass",
  },
  {
    slug: "roofing-cladding",
    name: "Roofing & Cladding",
    summary:
      "Exterior finishing that shapes how a building looks and performs, from façade cladding to entrance canopies.",
    image: images.img11,
    imageAlt: "Building façade finished in grey three-dimensional pyramid cladding panels",
    galleryFilter: "other",
  },
  {
    slug: "stainless-steel",
    name: "Stainless Steel Works",
    summary: "Carefully finished stainless steel railings and components that complement glass and aluminium work.",
    image: images.img14,
    imageAlt: "Stainless steel staircase railing with gold-coloured joints",
    galleryFilter: "other",
  },
  {
    slug: "mirrors-decorative-glass",
    name: "Mirrors & Decorative Glass",
    summary: "Custom mirror installations and decorative glass for residential and commercial interiors.",
    image: images.img07,
    imageAlt: "Round backlit LED mirror above a basin next to a glass shower screen",
    galleryFilter: "mirrors",
  },
  {
    slug: "fence-wiring",
    name: "Fence Wiring",
    summary: "Perimeter fence wiring installed as part of finishing a property's exterior.",
  },
];

export const serviceNames = services.map((s) => s.name);
