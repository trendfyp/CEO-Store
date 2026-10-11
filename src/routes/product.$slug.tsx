import { createFileRoute, Link } from "@tanstack/react-router";
import { getProductBySlug } from "@/data/catalog";
import { ProductView } from "@/components/store/product-view";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${getProductBySlug(params.slug)?.name ?? "Piece"} · VELORA` }],
  }),
  component: ProductRoute,
});

function ProductRoute() {
  const { slug } = Route.useParams();
  const product = getProductBySlug(slug);
  if (!product) {
    return (
      <div className="wrap py-16">
        <p className="eyebrow">Missing</p>
        <h1 className="mt-3 font-display text-5xl">That piece is not in the sample catalogue.</h1>
        <Link to="/shop" search={{ category: "all", q: "" }} className="btn btn-gold mt-8">
          Back to the shop
        </Link>
      </div>
    );
  }
  return <ProductView product={product} />;
}
