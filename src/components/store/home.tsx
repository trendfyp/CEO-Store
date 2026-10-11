import { Link } from "@tanstack/react-router";
import { categories, getProductBySlug, pairings, products, stockOf, withFlag } from "@/data/catalog";
import { money } from "@/lib/money";
import { Hero } from "@/components/store/hero";
import { Photo } from "@/components/store/photo";
import { ProductCard } from "@/components/store/product-card";
import { Reveal } from "@/components/store/reveal";

export function HomePage() {
  const featured = withFlag("featured");
  const popular = withFlag("popular");
  const trending = withFlag("trending");
  const bestsellers = withFlag("bestseller");
  const lead = featured[0];

  return (
    <>
      <Hero />

      <Reveal>
        <section className="wrap py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Featured</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">The first shelf</h2>
            </div>
            <Link to="/shop" search={{ category: "all", q: "" }} className="text-sm text-gold">
              All pieces
            </Link>
          </div>
          {lead && (
            <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr]">
              <Link to="/product/$slug" params={{ slug: lead.slug }} className="group block bg-surface">
                <Photo src={lead.image} alt={lead.name} className="feature-lead" priority />
                <div className="flex items-end justify-between gap-4 p-5">
                  <div>
                    <p className="font-display text-4xl">{lead.name}</p>
                    <p className="mt-1 text-sm text-muted">{lead.tagline}</p>
                  </div>
                  <p className="tabular-nums">{money(lead.price)}</p>
                </div>
              </Link>
              <div className="grid gap-6">
                {featured.slice(1).map((product) => (
                  <Link
                    key={product.id}
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    className="grid grid-cols-[7rem_1fr] gap-4 bg-surface p-3"
                  >
                    <Photo src={product.image} alt="" className="ratio-product" />
                    <span className="flex flex-col justify-end py-2">
                      <span className="font-display text-3xl">{product.name}</span>
                      <span className="mt-2 text-sm text-muted">{product.tagline}</span>
                      <span className="mt-3 tabular-nums">{money(product.price)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </Reveal>

      <Reveal>
        <section className="wrap py-8">
          <p className="eyebrow">Popular</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Often opened</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
            {popular.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-12">
          <div className="wrap">
            <p className="eyebrow">Trending</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Moving through the room</h2>
          </div>
          <div className="rail mt-8 flex gap-4 overflow-x-auto pb-2">
            {trending.map((product) => (
              <Link
                key={product.id}
                to="/product/$slug"
                params={{ slug: product.slug }}
                className="w-64 shrink-0"
              >
                <Photo src={product.image} alt={product.name} className="ratio-product" />
                <p className="mt-3 font-display text-3xl">{product.name}</p>
                <p className="text-sm text-muted">{money(product.price)} · sample</p>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="wrap py-12">
          <p className="eyebrow">Categories</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Choose a room</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
            {categories.map((category) => {
              const cover = products.find((product) => product.categoryId === category.id);
              return (
                <Link
                  key={category.id}
                  to="/shop"
                  search={{ category: category.id, q: "" }}
                  className="group relative block overflow-hidden bg-surface"
                >
                  {cover && <Photo src={cover.image} alt="" className="ratio-product" />}
                  <span className="scrim absolute inset-0" />
                  <span className="absolute inset-x-0 bottom-0 p-4">
                    <span className="block font-display text-3xl">{category.name}</span>
                    <span className="text-sm text-muted">{category.blurb}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="wrap py-12">
          <p className="eyebrow">Best sellers</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Asked for twice</h2>
          <ol className="mt-8 divide-y divide-line border-y border-line">
            {bestsellers.map((product, index) => (
              <li key={product.id}>
                <Link
                  to="/product/$slug"
                  params={{ slug: product.slug }}
                  className="grid grid-cols-[2rem_4.5rem_1fr_auto] items-center gap-4 py-4"
                >
                  <span className="text-sm text-faint tabular-nums">0{index + 1}</span>
                  <Photo src={product.image} alt="" className="ratio-product" />
                  <span>
                    <span className="block font-display text-3xl">{product.name}</span>
                    <span className="text-sm text-muted">{stockOf(product)} in the sample catalogue</span>
                  </span>
                  <span className="tabular-nums">{money(product.price)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section className="wrap py-12">
          <p className="eyebrow">Pairings</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Shown together</h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            Suggestions only. There is no discount, no countdown, and no promotional price. Each total is the
            sum of the sample prices.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pairings.map((pairing) => {
              const pieces = pairing.slugs
                .map((slug) => getProductBySlug(slug))
                .filter((item) => item != null);
              const sum = pieces.reduce((total, item) => total + item.price, 0);
              return (
                <article key={pairing.id} className="border border-line p-4">
                  <h3 className="font-display text-3xl">{pairing.title}</h3>
                  <p className="mt-2 text-sm text-muted">{pairing.text}</p>
                  <ul className="mt-4 space-y-3">
                    {pieces.map((product) => (
                      <li key={product.id}>
                        <Link
                          to="/product/$slug"
                          params={{ slug: product.slug }}
                          className="flex items-center justify-between gap-3"
                        >
                          <span>{product.name}</span>
                          <span className="tabular-nums text-sm text-muted">{money(product.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 border-t border-line pt-3 text-sm">
                    Sum of samples <span className="tabular-nums">{money(sum)}</span>
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="wrap grid gap-8 py-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">Trust</p>
            <h2 className="mt-3 font-display text-4xl">What is true today</h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
              <li>Every piece is labeled as a sample. Supplier ids begin with SAMPLE and are not live listings.</li>
              <li>The bag is saved on this device only. No card number is ever asked for.</li>
              <li>Stock counts are the sample catalogue, not a warehouse feed and not a scarcity tactic.</li>
              <li>A favorite heart does not create an account.</li>
            </ul>
          </div>
          <div className="grid gap-3">
            {[
              ["shipping", "Shipping", "Not calculated until a carrier exists."],
              ["returns", "Returns", "No sale means no return. The draft is published anyway."],
              ["support", "Support", "The contact form does not send."],
            ].map(([page, title, text]) => (
              <Link key={page} to="/info/$page" params={{ page }} className="border border-line p-5 hover:border-gold">
                <span className="block font-display text-3xl">{title}</span>
                <span className="mt-1 block text-sm text-muted">{text}</span>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>
    </>
  );
}
