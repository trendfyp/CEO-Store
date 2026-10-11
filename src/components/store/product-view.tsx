import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Minus, Plus } from "lucide-react";
import {
  categoryById,
  defaultVariant,
  relatedProducts,
  variantOf,
  type Product,
} from "@/data/catalog";
import { money } from "@/lib/money";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/cart-store";
import { useUi } from "@/lib/ui-store";
import { useBagActions, useCommerceReady } from "@/components/store/commerce";
import { Photo } from "@/components/store/photo";
import { ProductCard } from "@/components/store/product-card";

export function ProductView({ product }: { product: Product }) {
  const ready = useCommerceReady();
  const navigate = useNavigate();
  const lines = useCart((state) => state.lines);
  const favorites = useCart((state) => state.favorites);
  const toggleFavorite = useCart((state) => state.toggleFavorite);
  const notify = useUi((state) => state.notify);
  const { addToBag } = useBagActions();
  const category = categoryById(product.categoryId);
  const initial = defaultVariant(product);
  const [variantId, setVariantId] = useState(initial?.id ?? "");
  const [qty, setQty] = useState(1);
  const [image, setImage] = useState(product.images[0] ?? product.image);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const variant = variantOf(product, variantId) ?? initial;
  const saved = ready && favorites.includes(product.id);
  const related = relatedProducts(product);

  useEffect(() => {
    const next = defaultVariant(product);
    setVariantId(next?.id ?? "");
    setQty(1);
    setImage(product.images[0] ?? product.image);
    setZoom(false);
  }, [product]);

  if (!variant) return null;

  const changeQty = (next: number) => {
    if (!Number.isInteger(next)) return;
    if (next < 1) {
      setQty(1);
      return;
    }
    if (next > variant.stock) {
      setQty(Math.max(variant.stock, 1));
      notify(variant.stock > 0 ? `Only ${variant.stock} in this sample.` : "That finish is unavailable.");
      return;
    }
    setQty(next);
  };

  const buyNow = () => {
    const already = lines.some((line) => line.productId === product.id && line.variantId === variant.id);
    if (!already) {
      const ok = addToBag(product.id, variant.id, qty, { open: false });
      if (!ok) return;
    }
    void navigate({ to: "/checkout" });
  };

  return (
    <article className="wrap py-8">
      <p className="text-sm text-faint">
        <Link to="/shop" search={{ category: "all", q: "" }} className="hover:text-fg">
          Shop
        </Link>
        <span aria-hidden> / </span>
        {category && (
          <Link to="/shop" search={{ category: category.id, q: "" }} className="hover:text-fg">
            {category.name}
          </Link>
        )}
        <span aria-hidden> / </span>
        <span className="text-muted">{product.name}</span>
      </p>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <button
            type="button"
            className="zoom-frame"
            onClick={() => setZoom(true)}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setOrigin({
                x: ((event.clientX - rect.left) / rect.width) * 100,
                y: ((event.clientY - rect.top) / rect.height) * 100,
              });
            }}
            aria-label={`Enlarge ${product.name}`}
          >
            <img
              src={image}
              alt={product.name}
              width={1200}
              height={1600}
              className="zoom-img ratio-product w-full object-cover"
              style={{ ["--ox" as string]: `${origin.x}%`, ["--oy" as string]: `${origin.y}%` }}
            />
          </button>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((src) => (
                <button
                  key={src}
                  type="button"
                  className={cn("w-16 border", src === image ? "border-gold" : "border-line")}
                  onClick={() => setImage(src)}
                >
                  <Photo src={src} alt="" className="ratio-product" />
                </button>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-faint">Tap the photograph to enlarge. One studio view is on file.</p>
        </div>

        <div>
          <p className="eyebrow">{category?.name}</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">{product.name}</h1>
          <p className="mt-3 text-lg text-muted">{product.tagline}</p>
          <p className="mt-6 font-display text-4xl tabular-nums">{money(product.price)}</p>
          <p className="mt-1 text-sm text-faint">Sample price in USD. Not a local quote. No reference discount.</p>
          <p className="mt-4 text-sm text-muted">
            {variant.stock > 0
              ? `${variant.label}: ${variant.stock} in the sample catalogue.`
              : `${variant.label} is unavailable in this sample.`}
          </p>

          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Finish">
            {product.variants.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === variant.id}
                className={cn("btn btn-line", item.id === variant.id && "border-gold text-gold-2")}
                onClick={() => {
                  setVariantId(item.id);
                  setQty(1);
                }}
              >
                {item.label}
                {item.stock < 1 ? " · none" : ""}
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border border-line">
              <button type="button" className="icon-btn" aria-label="Decrease quantity" onClick={() => changeQty(qty - 1)}>
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center tabular-nums">{qty}</span>
              <button type="button" className="icon-btn" aria-label="Increase quantity" onClick={() => changeQty(qty + 1)}>
                <Plus className="size-4" />
              </button>
            </div>
            <button
              type="button"
              className={cn("icon-btn border border-line", saved && "text-gold")}
              aria-pressed={saved}
              aria-label={saved ? "Remove favorite" : "Save favorite"}
              disabled={!ready}
              onClick={() => toggleFavorite(product.id)}
            >
              <Heart className={cn("size-4", saved && "fill-current")} />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="btn btn-gold flex-1"
              disabled={!ready || variant.stock < 1}
              onClick={() => addToBag(product.id, variant.id, qty)}
            >
              {variant.stock > 0 ? "Add to bag" : "Unavailable"}
            </button>
            <button
              type="button"
              className="btn btn-line flex-1"
              disabled={!ready || variant.stock < 1}
              onClick={buyNow}
            >
              Buy now · demo
            </button>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-muted">{product.description}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
            {product.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <div className="mt-8 border border-line p-4 text-sm">
            <p className="eyebrow">Shipping</p>
            <p className="mt-2 text-muted">{product.shippingNote}</p>
            <p className="mt-3 text-faint">
              Supplier id {product.fulfillment.supplierProductId}. Tracking reference:{" "}
              {product.fulfillment.trackingRef ?? "none"}.
            </p>
            <p className="mt-2 text-faint">{product.fulfillment.note}</p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-4xl">Related pieces</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {zoom && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${product.name} enlarged`}>
          <button type="button" className="btn btn-line absolute top-4 right-4" onClick={() => setZoom(false)}>
            Close
          </button>
          <img
            src={image}
            alt={product.name}
            className="zoom-img is-zoomed"
            style={{ ["--ox" as string]: `${origin.x}%`, ["--oy" as string]: `${origin.y}%` }}
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setOrigin({
                x: ((event.clientX - rect.left) / rect.width) * 100,
                y: ((event.clientY - rect.top) / rect.height) * 100,
              });
            }}
          />
        </div>
      )}
    </article>
  );
}
