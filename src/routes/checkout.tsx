import { useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getProductById, variantOf } from "@/data/catalog";
import { merchandiseOf, useCart } from "@/lib/cart-store";
import { money } from "@/lib/money";
import { beginCheckout, type CheckoutContact, type CheckoutDraft } from "@/lib/payments";
import { useCommerceReady } from "@/components/store/commerce";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout demo · VELORA" }],
  }),
  component: CheckoutPage,
});

const empty: CheckoutContact = {
  name: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  note: "",
};

function CheckoutPage() {
  const ready = useCommerceReady();
  const lines = useCart((state) => state.lines);
  const visible = ready ? lines : [];
  const merchandise = merchandiseOf(visible);
  const [contact, setContact] = useState<CheckoutContact>(empty);
  const [errors, setErrors] = useState<string[]>([]);
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof CheckoutContact) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContact((current) => ({ ...current, [key]: event.target.value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: string[] = [];
    if (contact.name.trim().length < 2) nextErrors.push("Add the name that would receive a parcel.");
    if (!contact.email.includes("@") || contact.email.trim().length < 5) nextErrors.push("Add an email address.");
    if (contact.city.trim().length < 2) nextErrors.push("Add a city.");
    if (contact.address.trim().length < 4) nextErrors.push("Add a street address.");
    if (visible.length === 0) nextErrors.push("The bag is empty.");
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    const next: CheckoutDraft = {
      id: `demo_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "demo_unpaid",
      contact,
      merchandise,
      lines: visible.flatMap((line) => {
        const product = getProductById(line.productId);
        const variant = product ? variantOf(product, line.variantId) : undefined;
        if (!product || !variant) return [];
        return [
          {
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            variant: variant.label,
            qty: line.qty,
            unitPrice: product.price,
          },
        ];
      }),
    };

    setPending(true);
    const result = await beginCheckout(next);
    setPending(false);
    setDraft(result.draft);
    setMessage(result.message);
  };

  return (
    <div className="wrap py-8">
      <p className="eyebrow">Demo only</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">Checkout</h1>
      <div className="mt-4 border border-gold/40 bg-surface p-4 text-sm leading-relaxed text-muted">
        This is not a payment page. Card numbers are not collected. Submitting does not charge anyone and does
        not create an order. A provider is not assumed — not Stripe, PayPal, or Chapa.
      </div>

      {visible.length === 0 ? (
        <div className="mt-10">
          <p className="text-muted">Nothing is in the bag.</p>
          <Link to="/shop" search={{ category: "all", q: "" }} className="btn btn-gold mt-6">
            Return to the shop
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={submit} noValidate className="grid gap-4">
            <label className="field">
              Name
              <input value={contact.name} onChange={set("name")} autoComplete="name" />
            </label>
            <label className="field">
              Email
              <input value={contact.email} onChange={set("email")} autoComplete="email" inputMode="email" />
            </label>
            <label className="field">
              Phone, optional
              <input value={contact.phone} onChange={set("phone")} autoComplete="tel" inputMode="tel" />
            </label>
            <label className="field">
              City
              <input value={contact.city} onChange={set("city")} autoComplete="address-level2" />
            </label>
            <label className="field">
              Address
              <input value={contact.address} onChange={set("address")} autoComplete="street-address" />
            </label>
            <label className="field">
              Note
              <textarea value={contact.note} onChange={set("note")} />
            </label>
            {errors.length > 0 && (
              <ul className="text-sm text-danger">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
            <button type="submit" className="btn btn-gold" disabled={pending}>
              {pending ? "Checking" : "Review unpaid draft"}
            </button>
            <p className="text-xs leading-relaxed text-faint">
              Contact details stay on this screen only. They are not saved in the browser and they are not sent.
            </p>
          </form>

          <aside className="border border-line p-5">
            <h2 className="font-display text-3xl">Bag</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {visible.map((line) => {
                const product = getProductById(line.productId);
                const variant = product ? variantOf(product, line.variantId) : undefined;
                if (!product || !variant) return null;
                return (
                  <li key={`${line.productId}-${line.variantId}`} className="flex justify-between gap-3">
                    <span>
                      {product.name}
                      <span className="block text-faint">
                        {variant.label} · {line.qty}
                      </span>
                    </span>
                    <span className="tabular-nums">{money(product.price * line.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <span>Merchandise</span>
                <span className="tabular-nums">{money(merchandise)}</span>
              </div>
              <div className="flex justify-between text-faint">
                <span>Shipping</span>
                <span>Not calculated</span>
              </div>
              <div className="flex justify-between text-faint">
                <span>Charged</span>
                <span className="tabular-nums">{money(0)}</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {draft && message && (
        <section className="mt-10 border border-line p-5" aria-live="polite">
          <p className="eyebrow">Not placed</p>
          <h2 className="mt-2 font-display text-4xl">No order exists</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{message}</p>
          <p className="mt-3 text-sm text-faint">
            Reference {draft.id} · status {draft.status} · merchandise {money(draft.merchandise)} · charged{" "}
            {money(0)}
          </p>
          <div className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
            <p>Before a real launch, confirm each of these. None of them is done here:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>A seller of record, and a merchant account that has actually been approved.</li>
              <li>A settlement currency and a bank that can receive it from Ethiopia.</li>
              <li>Payment confirmation on a server, after a webhook — never a success screen in the browser.</li>
              <li>Verified supplier product ids, real costs, and a carrier with a price.</li>
              <li>A returns window you can honor, and a support address you will read.</li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
