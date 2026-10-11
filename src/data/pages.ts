export type InfoPage = {
  slug: string;
  title: string;
  kicker: string;
  paragraphs: string[];
};

export const infoPages: InfoPage[] = [
  {
    slug: "about",
    title: "About the atelier",
    kicker: "A name you can change",
    paragraphs: [
      "VELORA is a temporary name for a showroom of considered objects. It is meant to be renamed when the store has a real seller, a real catalogue, and a way to be paid.",
      "The pieces on this site are sample records with studio photographs made for the prototype. They are not live AliExpress listings, and the site does not scrape or embed a supplier.",
      "The person building this is in Ethiopia, starting without capital. Nothing here is a promise of stock, shipping, or a business that is already trading.",
    ],
  },
  {
    slug: "shipping",
    title: "Shipping",
    kicker: "Not offered yet",
    paragraphs: [
      "This prototype does not ship anything. No carrier, warehouse, or supplier account is connected, so a delivery date would be a fiction.",
      "Before launch, each product needs a confirmed origin, a real shipping cost, and a window you can actually meet. Those facts will replace this page.",
      "Until then, the bag can total merchandise only. Shipping is shown as not calculated.",
    ],
  },
  {
    slug: "returns",
    title: "Returns",
    kicker: "A draft, not a policy in force",
    paragraphs: [
      "There is no live returns desk, because there are no live sales. A contract of sale is not formed on this site.",
      "When a seller of record exists, publish a plain window: how many days, who pays return postage, and what condition an item must be in. Do not copy another store’s policy.",
      "Sample pieces in this catalogue cannot be returned, because they were never sold.",
    ],
  },
  {
    slug: "support",
    title: "Support",
    kicker: "No inbox is connected",
    paragraphs: [
      "Customer support is not staffed. The contact form on this site does not send a message anywhere.",
      "Do not enter card numbers, passwords, or identity documents into any field here. The checkout never asks for a card.",
      "When support is real, publish an address you actually read, and say how long a reply usually takes — only after you have measured it.",
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    kicker: "What this prototype keeps",
    paragraphs: [
      "Your bag and favorites are stored in this browser only, so they survive a refresh on the same phone. They are not an account and they are not sent to a server.",
      "Checkout contact details are shown once after you review a demo draft. They are not written to browser storage and they are not transmitted.",
      "There is no customer database attached. A future database must keep orders and profiles private to their owner. Public visitors should only be able to read published products.",
    ],
  },
  {
    slug: "terms",
    title: "Terms",
    kicker: "Demonstration only",
    paragraphs: [
      "Using this site does not buy anything. Prices are sample figures in US dollars, not a quote for Ethiopia or any other place, and not an offer of sale.",
      "Payments are intentionally unfinished. A screen that looks like checkout is still a demo until a verified provider confirms a real charge.",
      "Product text describes the sample. It is not a warranty, a certification, or a supplier specification.",
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    kicker: "Unsent by design",
    paragraphs: [
      "Write a note if you want to see the form. It stays on this screen and is discarded when you leave. Nothing is emailed.",
      "Publish a real address only when someone will read it.",
    ],
  },
];

export function getInfoPage(slug: string) {
  return infoPages.find((page) => page.slug === slug);
}
