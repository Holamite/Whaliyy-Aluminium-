import { images, type ImageAsset } from "./images";

/**
 * Portfolio data. Every photo comes from the gallery supplied by the business
 * (filenames were generic WhatsApp names, so each was categorised by what the
 * photo shows — see docs/IMAGE-MAP.md). Titles and descriptions only describe
 * what is visible; no client names, locations or specs have been added.
 * Add confirmed details in `details` when the business provides them.
 */

export const projectCategories = [
  { id: "all", label: "All Projects" },
  { id: "frameless-glass", label: "Frameless Glass" },
  { id: "curtain-walls", label: "Curtain Walls" },
  { id: "shower-cubicles", label: "Shower Cubicles" },
  { id: "mirrors", label: "Mirrors" },
  { id: "doors-windows", label: "Doors & Windows" },
  { id: "partitions", label: "Partitions" },
  { id: "other", label: "Other Works" },
] as const;

export type ProjectCategoryId = Exclude<(typeof projectCategories)[number]["id"], "all">;

export type ProjectMedia =
  | ({ type: "image"; alt: string } & ImageAsset)
  | { type: "video"; src: string; poster: string; alt: string; width: number; height: number };

export type Project = {
  id: string;
  title: string;
  /** First category is the primary label shown on the card. */
  categories: ProjectCategoryId[];
  /** Specific work type, e.g. "Stainless Steel Works". */
  workType: string;
  description: string;
  media: ProjectMedia[];
  /** Optional, confirmed details only (location, scope, materials...). */
  details?: string[];
};

const img = (asset: ImageAsset, alt: string): ProjectMedia => ({ type: "image", alt, ...asset });

export const projects: Project[] = [
  {
    id: "residence-windows-balcony",
    title: "Two-storey residence",
    categories: ["doors-windows"],
    workType: "Aluminium Windows",
    description:
      "Tall, slim window openings across both floors and a dark-glass balcony front, finished on a newly completed home.",
    media: [
      img(images.img01, "White two-storey house with tall dark-glass windows and a glass balcony front"),
      {
        type: "video",
        src: "/videos/residence-walkaround.mp4",
        poster: "/images/projects/aluminium-windows/residence-walkaround-poster.jpg",
        alt: "Short walk-around video of the finished two-storey residence",
        width: 480,
        height: 848,
      },
    ],
  },
  {
    id: "glass-stair-balustrade",
    title: "Glass staircase balustrade",
    categories: ["frameless-glass"],
    workType: "Frameless Glass",
    description: "Clear glass panels along an open staircase keep the living room bright and uninterrupted.",
    media: [img(images.img29, "Frameless glass staircase balustrade in a white living room with marble floors")],
  },
  {
    id: "tinted-swing-doors",
    title: "Tinted frameless swing doors",
    categories: ["frameless-glass"],
    workType: "Swing Glass Doors",
    description:
      "A pair of full-height tinted glass doors with decorative etched borders, gold patch fittings and long pull handles.",
    media: [img(images.img04, "Tinted frameless double glass doors with etched borders and gold handles")],
  },
  {
    id: "shower-led-mirror",
    title: "Shower screen & LED mirror",
    categories: ["shower-cubicles", "mirrors"],
    workType: "Shower Cubicle & Mirror",
    description:
      "A full-height glass shower screen with a black towel-bar handle, paired with a round backlit mirror over the basin.",
    media: [
      img(images.img07, "Glass shower screen beside a basin with a round blue-lit LED mirror"),
      img(images.img06, "Wider view of the glass shower enclosure and backlit mirror"),
    ],
  },
  {
    id: "frameless-office-partition",
    title: "Frameless office partition",
    categories: ["partitions", "frameless-glass"],
    workType: "Office Glass Partitioning",
    description: "Floor-to-ceiling glass panels with a matching glass door divide an open office without blocking light.",
    media: [img(images.img08, "Frameless glass partition wall with a glass door in an office with wooden floors")],
  },
  {
    id: "faceted-glass-facade",
    title: "Faceted glass façade",
    categories: ["curtain-walls"],
    workType: "Curtain Wall",
    description: "Angled glass units set in slim frames create a faceted, reflective building face.",
    media: [img(images.img05, "Faceted glass façade made of angled glass panels in slim metal frames")],
  },
  {
    id: "shower-enclosure-bathtub",
    title: "Corner shower enclosure",
    categories: ["shower-cubicles"],
    workType: "Glass Shower Cubicle",
    description: "A clear corner shower enclosure set beside a freestanding bathtub in a marble-tiled bathroom.",
    media: [img(images.img22, "Clear glass corner shower enclosure next to a freestanding bathtub")],
  },
  {
    id: "black-frame-sliding-doors",
    title: "Black-frame sliding doors",
    categories: ["doors-windows"],
    workType: "Aluminium Doors",
    description: "Wide sliding glass doors with a black aluminium grid frame, fitted across a ground-floor opening.",
    media: [img(images.img03, "Black aluminium-framed sliding glass doors with a grid pattern")],
  },
  {
    id: "pyramid-acp-cladding",
    title: "Pyramid panel cladding",
    categories: ["other"],
    workType: "Roofing & Cladding",
    description: "Grey three-dimensional pyramid panels wrap the upper façade of a two-storey building.",
    media: [img(images.img11, "Two-storey building clad in grey three-dimensional pyramid panels")],
  },
  {
    id: "floor-to-ceiling-windows",
    title: "Floor-to-ceiling tinted windows",
    categories: ["doors-windows"],
    workType: "Aluminium Windows",
    description: "Tall tinted glazing in slim aluminium frames, reflecting the garden and pool outside.",
    media: [
      img(images.img13, "Tall tinted aluminium window reflecting a swimming pool"),
      img(images.img10, "Tall tinted two-panel aluminium window set in a white wall"),
    ],
  },
  {
    id: "stair-balustrade",
    title: "Stainless steel stair railing",
    categories: ["other"],
    workType: "Stainless Steel Works",
    description: "A stainless steel staircase railing with horizontal rails and gold-finish joints, photographed during installation.",
    media: [
      img(images.img14, "Stainless steel staircase railing with gold-finish joints"),
      img(images.img15, "Stainless steel stair railing seen from the lower landing during installation"),
      img(images.img18, "Close view of the stainless steel stair railing's curved gold joint"),
    ],
  },
  {
    id: "frosted-shower-enclosure",
    title: "Frosted glass shower",
    categories: ["shower-cubicles"],
    workType: "Glass Shower Cubicle",
    description: "A frosted glass shower enclosure with gold hinges, fitted between the window wall and bathtub.",
    media: [img(images.img23, "Frosted glass shower enclosure with gold hinges in a white bathroom")],
  },
  {
    id: "three-storey-residence",
    title: "Three-storey residence",
    categories: ["doors-windows"],
    workType: "Aluminium Windows",
    description: "Wide aluminium-framed windows across three floors of a contemporary home.",
    media: [img(images.img20, "Contemporary three-storey white house with wide aluminium-framed windows")],
  },
  {
    id: "entrance-canopy",
    title: "Entrance canopy",
    categories: ["other"],
    workType: "Roofing",
    description: "A sloped, translucent canopy on a slim black frame shelters the side entrance of a home.",
    media: [
      img(images.img28, "Sloped translucent canopy with a black frame over a house entrance"),
      img(images.img30, "Side view of the translucent entrance canopy along a walkway"),
    ],
  },
  {
    id: "black-gold-stair-handrail",
    title: "Black & gold stair handrail",
    categories: ["other"],
    workType: "Stainless Steel Works",
    description: "A black-finish staircase handrail with gold accents running up a marble stairwell.",
    media: [img(images.img19, "Black staircase handrail with gold accents in a marble stairwell")],
  },
  {
    id: "side-entrance-door-window",
    title: "Side entrance door & window",
    categories: ["doors-windows"],
    workType: "Aluminium Doors & Windows",
    description: "A grey aluminium glazed door with a matching casement window beside it.",
    media: [img(images.img09, "Grey aluminium glazed door with a casement window beside it")],
  },
  {
    id: "commercial-facade-cladding",
    title: "Commercial façade cladding",
    categories: ["other"],
    workType: "Roofing & Cladding",
    description: "Green and white cladding panels across a multi-storey commercial building.",
    media: [img(images.img02, "Multi-storey building with green and white façade cladding")],
  },
  {
    id: "pyramid-fascia-perforated-screen",
    title: "Pyramid fascia & perforated screen",
    categories: ["other"],
    workType: "Roofing & Cladding",
    description: "Pyramid-panel fascia above a white perforated screen on a single-storey building, near completion.",
    media: [img(images.img12, "Grey pyramid-panel fascia above a white perforated screen")],
  },
  {
    id: "duplex-window-installation",
    title: "Duplex windows",
    categories: ["doors-windows"],
    workType: "Aluminium Windows",
    description: "Dark-framed windows across a stone-clad duplex, photographed as the build neared completion.",
    media: [img(images.img24, "Duplex with dark-framed windows and stone-clad columns")],
  },
  {
    id: "residence-blue-tinted-windows",
    title: "Blue-tinted windows",
    categories: ["doors-windows"],
    workType: "Aluminium Windows",
    description: "Blue-tinted glazing on the windows of a white two-storey home.",
    media: [img(images.img17, "White two-storey house with blue-tinted windows")],
  },
  {
    id: "duplex-exterior",
    title: "Duplex exterior",
    categories: ["doors-windows"],
    workType: "Aluminium Windows",
    description: "A completed duplex with blue-tinted windows and a glass balcony front.",
    media: [img(images.img21, "Completed duplex with blue-tinted windows behind a gated compound")],
  },
  {
    id: "three-storey-build",
    title: "Three-storey build",
    categories: ["doors-windows"],
    workType: "Aluminium Windows",
    description: "Window installation in progress on a grey-rendered three-storey building.",
    media: [img(images.img25, "Three-storey grey building with windows being installed")],
  },
  {
    id: "shopfront-cladding",
    title: "Shopfront cladding in progress",
    categories: ["other"],
    workType: "Roofing & Cladding",
    description: "Cladding panels, still in their protective film, going up on a shopfront.",
    media: [img(images.img16, "Workers on scaffolding fitting cladding panels on a shopfront")],
  },
  {
    id: "window-frames-fabrication",
    title: "Window frames in fabrication",
    categories: ["other"],
    workType: "Aluminium Fabrication",
    description: "Glazed aluminium window units assembled and ready to go on site.",
    media: [
      img(images.img26, "Glazed aluminium window frames stacked after fabrication"),
      img(images.img27, "Aluminium window panels laid out ready for installation"),
    ],
  },
];
