import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import {
  categories,
  categoryById,
  getProductById,
  searchProducts,
  variantOf,
} from "@/data/catalog";
import { merchandiseOf, useBagCount, useCart } from "@/lib/cart-store";
import { money } from "@/lib/money";
import { useUi } from "@/lib/ui-store";
import { useBagActions, useCommerceReady } from "@/components/store/commerce";
import { cn } from "@/lib/cn";
import { Photo } from "@/components/store/photo";

function Sheet({
  open,
  title,
  onClose,
  children,
  side = "right",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  side?: "right" | "left";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <div className={cn("sheet", open && "is-open")} aria-hidden={!open}>
      <button type="button" className="sheet-backdrop" aria-label="Close" tabIndex={open ? 0 : -1} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        inert={open ? undefined : true}
        className={cn("sheet-panel", side === "left" && "sheet-left")}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-3xl">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const ready = useCommerceReady();
  const panel = useUi((state) => state.panel);
  const close = useUi((state) => state.close);
  const lines = useCart((state) => state.lines);
  const setQty = useCart((state) => state.setQty);
  const remove = useCart((state) => state.remove);
  const notify = useUi((state) => state.notify);
  const open = panel === "cart";
  const visible = ready ? lines : [];
  const subtotal = merchandiseOf(visible);

  return (
    <Sheet open={open} title="Bag" onClose={close}>
      {visible.length === 0 ? (
        <div className="flex h-full flex-col justify-between gap-8">
          <div>
            <p className="text-muted">Your bag is empty. The sample catalogue is still here to browse.</p>
          </div>
          <Link to="/shop" search={{ category: "all", q: "" }} className="btn btn-gold" onClick={close}>
            Browse pieces
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-5">
            {visible.map((line) => {
              const product = getProductById(line.productId);
              const variant = product ? variantOf(product, line.variantId) : undefined;
              if (!product || !variant) return null;
              return (
                <li key={`${line.productId}-${line.variantId}`} className="grid grid-cols-[4.5rem_1fr] gap-3">
                  <Link to="/product/$slug" params={{ slug: product.slug }} onClick={close}>
                    <Photo src={product.image} alt="" className="ratio-product" />
                  </Link>
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-2xl leading-none">{product.name}</p>
                        <p className="mt-1 text-sm text-muted">{variant.label}</p>
                      </div>
                      <p className="tabular-nums text-sm">{money(product.price * line.qty)}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          className="icon-btn"
                          aria-label={`Decrease ${product.name}`}
                          onClick={() => {
                            const result = setQty(product.id, variant.id, line.qty - 1);
                            if (!result.ok) notify(result.reason);
                          }}
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-8 text-center tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          className="icon-btn"
                          aria-label={`Increase ${product.name}`}
                          onClick={() => {
                            const result = setQty(product.id, variant.id, line.qty + 1);
                            if (!result.ok) notify(result.reason);
                            else if (result.clamped) notify(`Only ${result.stock} in this sample.`);
                          }}
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
                        onClick={() => remove(product.id, variant.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Merchandise</span>
              <span className="tabular-nums">{money(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-faint">
              <span>Shipping</span>
              <span>Not calculated</span>
            </div>
            <div className="mt-2 flex justify-between text-faint">
              <span>Tax</span>
              <span>Not calculated</span>
            </div>
            <div className="mt-4 flex justify-between text-base text-fg">
              <span>Total due today</span>
              <span className="tabular-nums">{money(0)}</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-faint">
              The merchandise figure is a sample subtotal. Nothing is due, because payment is not connected.
              Shipping and tax are omitted on purpose.
            </p>
            <Link to="/checkout" className="btn btn-gold mt-5 w-full" onClick={close}>
              Review checkout demo
            </Link>
          </div>
        </div>
      )}
    </Sheet>
  );
}

export function SearchPanel() {
  const panel = useUi((state) => state.panel);
  const close = useUi((state) => state.close);
  const [query, setQuery] = useState("");
  const open = panel === "search";
  const results = useMemo(() => searchProducts(query).slice(0, 8), [query]);

  return (
    <Sheet open={open} title="Search" onClose={close}>
      <label className="field">
        <span className="eyebrow">Catalogue</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Lamp, journal, speaker…"
          autoFocus={open}
        />
      </label>
      <ul className="mt-6 flex flex-col gap-3">
        {results.length === 0 && <li className="text-sm text-muted">No sample pieces match that.</li>}
        {results.map((product) => (
          <li key={product.id}>
            <Link
              to="/product/$slug"
              params={{ slug: product.slug }}
              onClick={close}
              className="grid grid-cols-[3.2rem_1fr_auto] items-center gap-3"
            >
              <Photo src={product.image} alt="" className="ratio-product" />
              <span>
                <span className="block font-display text-2xl leading-none">{product.name}</span>
                <span className="text-xs text-faint">{categoryById(product.categoryId)?.name}</span>
              </span>
              <span className="tabular-nums text-sm">{money(product.price)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}

export function AccountPanel() {
  const ready = useCommerceReady();
  const panel = useUi((state) => state.panel);
  const close = useUi((state) => state.close);
  const favorites = useCart((state) => state.favorites);
  const saved = ready ? favorites.map((id) => getProductById(id)).filter((item) => item != null) : [];

  return (
    <Sheet open={panel === "account"} title="Account" onClose={close}>
      <p className="text-sm leading-relaxed text-muted">
        An account is not part of this prototype. Favorites and your bag stay in this browser only. They are
        not synced, and they are not a customer profile.
      </p>
      <h3 className="mt-8 font-display text-3xl">Saved here</h3>
      {saved.length === 0 ? (
        <p className="mt-3 text-sm text-faint">Nothing saved yet. Use the heart on a piece.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {saved.map((product) => (
            <li key={product.id}>
              <Link
                to="/product/$slug"
                params={{ slug: product.slug }}
                onClick={close}
                className="flex items-center justify-between gap-3"
              >
                <span className="font-display text-2xl">{product.name}</span>
                <span className="tabular-nums text-sm">{money(product.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}

export function MenuPanel() {
  const panel = useUi((state) => state.panel);
  const close = useUi((state) => state.close);
  return (
    <Sheet open={panel === "menu"} title="Menu" onClose={close} side="left">
      <nav className="flex flex-col gap-2">
        <Link to="/shop" search={{ category: "all", q: "" }} className="font-display text-4xl" onClick={close}>
          All pieces
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to="/shop"
            search={{ category: category.id, q: "" }}
            className="font-display text-4xl text-muted"
            onClick={close}
          >
            {category.name}
          </Link>
        ))}
        <Link to="/info/$page" params={{ page: "about" }} className="mt-6 text-sm text-gold" onClick={close}>
          About this prototype
        </Link>
      </nav>
    </Sheet>
  );
}

export function QuickView() {
  const ready = useCommerceReady();
  const quickId = useUi((state) => state.quickId);
  const close = useUi((state) => state.close);
  const product = quickId ? getProductById(quickId) : undefined;
  const [variantId, setVariantId] = useState<string | null>(null);
  const { addToBag } = useBagActions();

  useEffect(() => {
    if (product) setVariantId(product.variants.find((item) => item.stock > 0)?.id ?? product.variants[0]?.id ?? null);
  }, [product]);

  const variant = product?.variants.find((item) => item.id === variantId) ?? product?.variants[0];

  return (
    <Sheet open={Boolean(product)} title={product?.name ?? "Piece"} onClose={close}>
      {product && variant && (
        <div>
          <Photo src={product.image} alt={product.name} className="ratio-product" priority />
          <p className="mt-4 text-sm text-muted">{product.tagline}</p>
          <p className="mt-3 font-display text-4xl tabular-nums">{money(product.price)}</p>
          <p className="mt-1 text-xs text-faint">Sample price · USD · {variant.stock} available in this finish</p>
          {product.variants.length > 1 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.variants.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === variant.id}
                  className={cn(
                    "btn btn-line",
                    item.id === variant.id && "border-gold text-gold-2",
                    item.stock < 1 && "opacity-40",
                  )}
                  onClick={() => setVariantId(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              className="btn btn-gold"
              disabled={!ready || variant.stock < 1}
              onClick={() => addToBag(product.id, variant.id, 1)}
            >
              {variant.stock > 0 ? "Add to bag" : "Unavailable"}
            </button>
            <Link to="/product/$slug" params={{ slug: product.slug }} className="btn btn-line" onClick={close}>
              Full details
            </Link>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-faint">{product.fulfillment.note}</p>
        </div>
      )}
    </Sheet>
  );
}

export function MobileDock() {
  const ready = useCommerceReady();
  const count = useBagCount(ready);
  const open = useUi((state) => state.open);
  const path = useRouterState({ select: (state) => state.location.pathname });

  return (
    <nav className="dock fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-3">
        <Link
          to="/shop"
          search={{ category: "all", q: "" }}
          className={cn(
            "flex min-h-14 items-center justify-center text-xs tracking-widest uppercase",
            path.startsWith("/shop") ? "text-gold" : "text-muted",
          )}
        >
          Shop
        </Link>
        <button type="button" className="min-h-14 text-xs tracking-widest text-muted uppercase" onClick={() => open("search")}>
          Search
        </button>
        <button type="button" className="min-h-14 text-xs tracking-widest text-muted uppercase" onClick={() => open("cart")}>
          Bag{count > 0 ? ` ${count}` : ""}
        </button>
      </div>
    </nav>
  );
}
