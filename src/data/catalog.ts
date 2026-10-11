/**
 * Sample catalogue for the VELORA prototype.
 * These records are not live AliExpress listings and must not be described as such.
 * `cost` is an internal planning figure. Never render it as a strikethrough discount.
 * Replace this module with verified supplier data before any real sale.
 */

export type Variant = {
  id: string;
  label: string;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  tagline: string;
  description: string;
  notes: string[];
  price: number;
  currency: "USD";
  cost: number;
  image: string;
  images: string[];
  flags: Array<"featured" | "trending" | "bestseller" | "popular">;
  fulfillment: {
    supplierProductId: string;
    trackingRef: string | null;
    note: string;
  };
  shippingNote: string;
  variants: Variant[];
};

export type Category = {
  id: string;
  name: string;
  blurb: string;
};

export const SHIPPING_NOTE =
  "Delivery time is not published. No carrier, warehouse, or supplier account is connected to this prototype.";

const sampleNote =
  "Sample record only. Not a live supplier listing. Swap in a verified product id, cost, and shipping sheet before launch.";

export const categories: Category[] = [
  { id: "lighting", name: "Lighting", blurb: "Rings, vessels, and small suns." },
  { id: "audio", name: "Audio", blurb: "Sound for a desk, not a stadium." },
  { id: "time", name: "Time", blurb: "Cases without the noise." },
  { id: "home", name: "Home", blurb: "Objects that stay in the room." },
  { id: "carry", name: "Carry", blurb: "What leaves with you." },
  { id: "desk", name: "Desk", blurb: "Instruments for the work surface." },
  { id: "wear", name: "Wear", blurb: "Lines worn close." },
];

export const products: Product[] = [
  {
    id: "p_halo",
    slug: "halo-arc",
    name: "Halo Arc",
    categoryId: "lighting",
    tagline: "A ring of warm light for the desk.",
    description:
      "A standing halo in brushed metal over a charcoal stone base. The ring is the lamp: light sits inside the circle rather than under a shade. This is a sample piece for the lighting shelf, photographed once in studio.",
    notes: ["Metal ring, stone base", "Warm light, not a color-changing lamp", "One studio photograph"],
    price: 214,
    currency: "USD",
    cost: 86,
    image: "/products/halo-arc.jpg",
    images: ["/products/halo-arc.jpg"],
    flags: ["featured", "bestseller"],
    fulfillment: { supplierProductId: "SAMPLE-HALO-014", trackingRef: null, note: sampleNote },
    shippingNote: SHIPPING_NOTE,
    variants: [
      { id: "brass", label: "Brass", stock: 8 },
      { id: "blackened", label: "Blackened", stock: 4 },
    ],
  },
  {
    id: "p_solace",
    slug: "solace",
    name: "Solace",
    categoryId: "audio",
    tagline: "A small room of sound.",
    description:
      "A pebble of matte ceramic with a metal ring at the waist, drawn as a wireless speaker for a desk or shelf. Battery life, codecs, and loudness are not claimed — those figures need a verified supplier sheet.",
    notes: ["Ceramic body, metal ring", "Wireless, unverified range", "No loudness claim"],
    price: 268,
    currency: "USD",
    cost: 104,
    image: "/products/solace.jpg",
    images: ["/products/solace.jpg"],
    flags: ["trending", "bestseller", "popular"],
    fulfillment: { supplierProductId: "SAMPLE-SOL-008", trackingRef: null, note: sampleNote },
    shippingNote: SHIPPING_NOTE,
    variants: [
      { id: "charcoal", label: "Charcoal", stock: 5 },
      { id: "sand", label: "Sand", stock: 3 },
    ],
  },
  {
    id: "p_meridian",
    slug: "meridian",
    name: "Meridian",
    categoryId: "time",
    tagline: "Time, without the noise.",
    description:
      "A slim case in champagne metal and a dark dial with no logo. Strap options are part of the sample record. Water resistance and movement type stay unpublished until a real watch is sourced.",
    notes: ["No logo on the dial", "Strap is a sample option", "Movement not specified"],
    price: 390,
    currency: "USD",
    cost: 155,
    image: "/products/meridian.jpg",
    images: ["/products/meridian.jpg"],
    flags: ["featured"],
    fulfillment: { supplierProductId: "SAMPLE-MER-003", trackingRef: null, note: sampleNote },
    shippingNote: SHIPPING_NOTE,
    variants: [
      { id: "leather", label: "Leather strap", stock: 3 },
      { id: "mesh", label: "Mesh strap", stock: 2 },
    ],
  },
  {
    id: "p_orbit",
    slug: "orbit",
    name: "Orbit Case",
    categoryId: "audio",
    tagline: "A case that closes cleanly.",
    description:
      "An oval metal case with two buds. Fit, battery, and noise control are not stated, because this is not a tested listing.",
    notes: ["Metal case", "Two buds", "No battery claim"],
    price: 96,
    currency: "USD",
    cost: 34,
    image: "/products/orbit.jpg",
    images: ["/products/orbit.jpg"],
    flags: ["trending", "popular"],
    fulfillment: { supplierProductId: "SAMPLE-ORB-021", trackingRef: null, note: sampleNote },
    shippingNote: SHIPPING_NOTE,
    variants: [
      { id: "champagne", label: "Champagne", stock: 14 },
      { id: "graphite", label: "Graphite", stock: 6 },
    ],
  },
  {
    id: "p_lumen",
    slug: "lumen-vessel",
    name: "Lumen Vessel",
    categoryId: "lighting",
    tagline: "Glass that holds a little sun.",
    description:
      "A hand-blown amber form on a low plinth, lit from within. A real piece would vary from the photograph. This view is one sample.",
    notes: ["Amber glass", "Lit from within", "Shape would vary in production"],
    price: 78,
    currency: "USD",
    cost: 28,
    image: "/products/lumen.jpg",
    images: ["/products/lumen.jpg"],
    flags: ["featured", "popular"],
    fulfillment: { supplierProductId: "SAMPLE-LUM-011", trackingRef: null, note: sampleNote },
    shippingNote: SHIPPING_NOTE,
    variants: [{ id: "amber", label: "Amber", stock: 14 }],
  },
  {
    id: "p_atlas",
    slug: "atlas-sleeve",
    name: "Atlas Sleeve",
    categoryId: "carry",
    tagline: "Leather, cut close.",
    description:
      "A charcoal sleeve with a gold edge, drawn for a laptop. Sizes are labels in the sample data, not measured stock from a factory.",
    notes: ["Charcoal leather, gold edge", "Sizes are sample labels", "Not a measured factory run"],
    price: 84,
    currency: "USD",
    cost: 29,
    image: "/products/atlas.jpg",
    images: ["/products/atlas.jpg"],
    flags: ["bestseller", "popular"],
    fulfillment: { supplierProductId: "SAMPLE-ATL-019", trackingRef: null, note: sampleNote },
    shippingNote: SHIPPING_NOTE,
    variants: [
      { id: "13", label: "13 inch", stock: 10 },
      { id: "16", label: "16 inch", stock: 8 },
    ],
  },
  {
    id: "p_nimbus",
    slug: "nimbus",
    name: "Nimbus",
    categoryId: "home",
    tagline: "A quiet disc of vapor.",
    description:
      "Stone-colored ceramic with a metal top, drawn as a diffuser. Fragrance oils are not included and are not sold here.",
    notes: ["Ceramic body", "Oils not included", "Runtime not claimed"],
    price: 128,
    currency: "USD",
    cost: 47,
    image: "/products/nimbus.jpg",
    images: ["/products/nimbus.jpg"],
    flags: ["trending"],
    fulfillment: { supplierProductId: "SAMPLE-NIM-006", trackingRef: null, note: sampleNote },
    shippingNote: SHIPPING_NOTE,
    variants: [{ id: "stone", label: "Stone", stock: 9 }],
  },
  {
    id: "p_vector",
    slug: "vector-frames",
    name: "Vector Frames",
    categoryId: "wear",
    tagline: "A thin line for the face.",
    description:
      "Champagne metal frames and dark lenses. Lens category and UV claims are omitted until a supplier confirms them.",
    notes: ["Metal frames", "No UV claim", "Dusk is out of stock in this sample"],
    price: 112,
    currency: "USD",
    cost: 41,
    image: "/products/vector.jpg",
    images: ["/products/vector.jpg"],
    flags: ["popular"],
    fulfillment: { supplierProductId: "SAMPLE-VEC-016", trackingRef: null, note: sampleNote },
    shippingNote: SHIPPING_NOTE,
    variants: [
      { id: "night", label: "Night", stock: 7 },
      { id: "dusk", label: "Dusk", stock: 0 },
    ],
  },
  {
    id: "p_pulse",
    slug: "pulse-stone",
    name: "Pulse Stone",
    categoryId: "desk",
    tagline: "Charge, without the cable clutter.",
    description:
      "A basalt-like puck with an inlaid ring. Wattage is not published. It is a sample of a charging object, not a certified charger.",
    notes: ["Stone-like puck", "Wattage unpublished", "Not a certified charger"],
    price: 58,
    currency: "USD",
    cost: 18,
    image: "/products/pulse.jpg",
    images: ["/products/pulse.jpg"],
    flags: ["popular"],
    fulfillment: { supplierProductId: "SAMPLE-PUL-027", trackingRef: null, note: sampleNote },
    shippingNote: SHIPPING_NOTE,
    variants: [{ id: "basalt", label: "Basalt", stock: 24 }],
  },
  {
    id: "p_kin",
    slug: "kin-journal",
    name: "Kin Journal",
    categoryId: "desk",
    tagline: "Pages with a gold edge.",
    description:
      "Ivory cloth, a black ribbon, and gilt edges. Paper weight is not specified in this sample.",
    notes: ["Cloth cover", "Gilt edges", "Paper weight unpublished"],
    price: 42,
    currency: "USD",
    cost: 11,
    image: "/products/kin.jpg",
    images: ["/products/kin.jpg"],
    flags: ["popular"],
    fulfillment: { supplierProductId: "SAMPLE-KIN-030", trackingRef: null, note: sampleNote },
    shippingNote: SHIPPING_NOTE,
    variants: [{ id: "ivory", label: "Ivory", stock: 30 }],
  },
];

export const pairings = [
  {
    id: "desk",
    title: "A desk, finished",
    text: "Light and a place to write. Shown together as a suggestion, not a promotion.",
    slugs: ["halo-arc", "kin-journal"],
  },
  {
    id: "sound",
    title: "Near and far",
    text: "A speaker for the room, buds for the walk. No bundle price is applied.",
    slugs: ["solace", "orbit"],
  },
  {
    id: "leave",
    title: "Leave lighter",
    text: "A sleeve and a watch. The total below is only the sum of the sample prices.",
    slugs: ["atlas-sleeve", "meridian"],
  },
] as const;

export function categoryById(id: string) {
  return categories.find((category) => category.id === id);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function variantOf(product: Product, variantId: string) {
  return product.variants.find((variant) => variant.id === variantId);
}

export function stockOf(product: Product) {
  return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
}

export function defaultVariant(product: Product) {
  return product.variants.find((variant) => variant.stock > 0) ?? product.variants[0];
}

export function withFlag(flag: Product["flags"][number]) {
  return products.filter((product) => product.flags.includes(flag));
}

export function relatedProducts(product: Product) {
  const same = products.filter(
    (item) => item.categoryId === product.categoryId && item.id !== product.id,
  );
  const rest = products.filter(
    (item) => item.categoryId !== product.categoryId && item.id !== product.id,
  );
  return [...same, ...rest].slice(0, 3);
}

export function searchProducts(query: string, categoryId = "all") {
  const q = query.trim().toLowerCase();
  return products.filter((product) => {
    if (categoryId !== "all" && product.categoryId !== categoryId) return false;
    if (!q) return true;
    const category = categoryById(product.categoryId)?.name ?? "";
    const hay = [product.name, product.tagline, product.description, category]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}
