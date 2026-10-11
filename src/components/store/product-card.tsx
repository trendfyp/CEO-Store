import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { categoryById, defaultVariant, stockOf, type Product } from "@/data/catalog";
import { money } from "@/lib/money";
import { cn } from "@/lib/cn";
import { useCart } from "@/lib/cart-store";
import { useUi } from "@/lib/ui-store";
import { useBagActions, useCommerceReady } from "@/components/store/commerce";
import { Photo } from "@/components/store/photo";

export function ProductCard({ product }: { product: Product }) {
  const ready = useCommerceReady();
  const favorites = useCart((state) => state.favorites);
  const toggleFavorite = useCart((state) => state.toggleFavorite);
  const setQuick = useUi((state) => state.setQuick);
  const { addToBag } = useBagActions();
  const category = categoryById(product.categoryId);
  const variant = defaultVariant(product);
  const stock = stockOf(product);
  const saved = ready && favorites.includes(product.id);

  return (
    <article className="card flex flex-col">
      <div className="card-frame relative overflow-hidden bg-surface">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block"
          aria-label={product.name}
        >
          <Photo src={product.image} alt={product.name} className="ratio-product" />
        </Link>
        <button
          type="button"
          className={cn("icon-btn absolute top-2 right-2 bg-bg/70", saved && "text-gold")}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from favorites` : `Save ${product.name}`}
          disabled={!ready}
          onClick={() => toggleFavorite(product.id)}
        >
          <Heart className={cn("size-4", saved && "fill-current")} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 pt-4">
        <p className="text-xs tracking-widest text-faint uppercase">{category?.name}</p>
        <h3 className="font-display text-2xl">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:text-gold-2">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-muted">{product.tagline}</p>
        <p className="mt-auto flex items-baseline justify-between gap-3 pt-3">
          <span className="tabular-nums text-base">{money(product.price)}</span>
          <span className="text-xs text-faint">
            {stock > 0 ? `${stock} in sample` : "Unavailable"}
          </span>
        </p>
        <button
          type="button"
          className="btn btn-gold btn-compact mt-2 w-full"
          disabled={!ready || !variant || variant.stock < 1}
          onClick={() => variant && addToBag(product.id, variant.id, 1)}
        >
          {variant && variant.stock > 0 ? "Add to bag" : "Unavailable"}
        </button>
        <button type="button" className="text-link mt-1" onClick={() => setQuick(product.id)}>
          Quick view
        </button>
      </div>
    </article>
  );
}
