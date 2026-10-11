import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { categories, products, searchProducts } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { ProductCard } from "@/components/store/product-card";

type ShopSearch = { category: string; q: string };
type SortKey = "shelf" | "price-asc" | "price-desc" | "name";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search.category === "string" && search.category.length > 0 ? search.category : "all",
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [{ title: "Shop · VELORA" }],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { category, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [sort, setSort] = useState<SortKey>("shelf");
  const active = categories.find((item) => item.id === category);

  const items = useMemo(() => {
    const list = searchProducts(q, category);
    const copy = [...list];
    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
    if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  }, [category, q, sort]);

  return (
    <div className="wrap py-8">
      <p className="eyebrow">Catalogue</p>
      <h1 className="mt-3 font-display text-5xl md:text-6xl">{active ? active.name : "All pieces"}</h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        {active ? active.blurb : "Ten sample pieces. Filter by room, or search the names."}{" "}
        {products.length} records in the prototype. None are live supplier listings.
      </p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          className={cn("btn btn-line shrink-0", category === "all" && "border-gold text-gold-2")}
          onClick={() => navigate({ search: { category: "all", q } })}
        >
          All
        </button>
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn("btn btn-line shrink-0", category === item.id && "border-gold text-gold-2")}
            onClick={() => navigate({ search: { category: item.id, q } })}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="field max-w-sm flex-1">
          <span className="eyebrow">Search</span>
          <input
            value={q}
            onChange={(event) => navigate({ search: { category, q: event.target.value } })}
            placeholder="Name or material"
          />
        </label>
        <label className="field w-full sm:w-52">
          <span className="eyebrow">Sort</span>
          <select className="select" value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            <option value="shelf">Shelf order</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      {items.length === 0 ? (
        <p className="mt-16 text-muted">Nothing in this sample matches. Try another room.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
