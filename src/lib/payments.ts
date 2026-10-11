/**
 * Provider-independent payment point.
 * Replace `beginCheckout` with a server call that creates a payment session.
 * Never mark an order paid in the browser. A later webhook, checked on the server,
 * is the only place a status may become "paid".
 *
 * Before any real launch, confirm all of the following:
 * - Who the seller of record is
 * - That a merchant account is actually approved
 * - Which currency settles, and into which bank
 * - That the provider works for a business starting in Ethiopia
 * - Supplier accounts, real shipping costs, and a returns process
 *
 * Do not assume Stripe, PayPal, Chapa, or any other provider will approve an account.
 */

export type CheckoutContact = {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  note: string;
};

export type CheckoutLine = {
  productId: string;
  variantId: string;
  name: string;
  variant: string;
  qty: number;
  unitPrice: number;
};

export type CheckoutDraft = {
  id: string;
  createdAt: string;
  status: "demo_unpaid";
  contact: CheckoutContact;
  lines: CheckoutLine[];
  merchandise: number;
};

export type CheckoutResult =
  | { ok: false; code: "unconfigured"; message: string; draft: CheckoutDraft };

export async function beginCheckout(draft: CheckoutDraft): Promise<CheckoutResult> {
  return {
    ok: false,
    code: "unconfigured",
    message:
      "No payment provider is configured. Nothing was charged, and no order was sent to a supplier.",
    draft,
  };
}
