import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { categories } from "@/data/catalog";
import { infoPages } from "@/data/pages";
import { useBagCount } from "@/lib/cart-store";
import { useUi } from "@/lib/ui-store";
import { useCommerceReady } from "@/components/store/commerce";
import { AccountPanel, CartDrawer, MenuPanel, MobileDock, QuickView, SearchPanel } from "@/components/store/sheets";

const NAV = ["lighting", "audio", "time", "home", "desk"];

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-7 text-gold" aria-hidden>
      <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function StoreChrome({ children }: { children: ReactNode }) {
  const ready = useCommerceReady();
  const count = useBagCount(ready);
  const open = useUi((state) => state.open);
  const notice = useUi((state) => state.notice);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a href="#content" className="skip">
        Skip to content
      </a>
      <div className="border-b border-line bg-surface px-4 py-2 text-center text-xs leading-relaxed text-muted">
        Sample catalogue. No payment is taken and no supplier order is placed.
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <div className="wrap flex h-16 items-center gap-3">
          <button type="button" className="icon-btn md:hidden" aria-label="Open menu" onClick={() => open("menu")}>
            <Menu className="size-5" />
          </button>
          <Link to="/" className="flex items-center gap-2" aria-label="VELORA home">
            <Mark />
            <span className="font-display text-2xl tracking-wide">VELORA</span>
          </Link>
          <nav className="ml-6 hidden items-center gap-5 md:flex" aria-label="Categories">
            <Link to="/shop" search={{ category: "all", q: "" }} className="text-sm text-muted hover:text-fg">
              Shop
            </Link>
            {NAV.map((id) => {
              const category = categories.find((item) => item.id === id);
              if (!category) return null;
              return (
                <Link
                  key={id}
                  to="/shop"
                  search={{ category: id, q: "" }}
                  className="text-sm text-muted hover:text-fg"
                >
                  {category.name}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center">
            <button type="button" className="icon-btn" aria-label="Search the catalogue" onClick={() => open("search")}>
              <Search className="size-5" />
            </button>
            <button type="button" className="icon-btn" aria-label="Account" onClick={() => open("account")}>
              <UserRound className="size-5" />
            </button>
            <button type="button" className="icon-btn relative" aria-label={`Bag, ${count} items`} onClick={() => open("cart")}>
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute top-1 right-0 grid min-w-5 place-items-center bg-gold px-1 text-xs text-bg tabular-nums">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <main id="content" className="pb-20 md:pb-0">
        {children}
      </main>
      <footer className="mt-20 border-t border-line">
        <div className="wrap grid gap-10 py-14 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-display text-3xl">VELORA</p>
            <p className="mt-3 max-w-xs text-sm text-muted">
              A prototype showroom. Rename it when the catalogue and a payment account are real.
            </p>
          </div>
          <div>
            <p className="eyebrow">Shop</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to="/shop" search={{ category: category.id, q: "" }} className="hover:text-fg">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Care</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {infoPages.map((page) => (
                <li key={page.slug}>
                  <Link to="/info/$page" params={{ page: page.slug }} className="hover:text-fg">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Before launch</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Confirm a seller of record, a merchant account that can settle, real supplier ids, and shipping
              you can actually fulfill. This footer is not a storefront guarantee.
            </p>
          </div>
        </div>
        <div className="border-t border-line py-4 text-center text-xs text-faint">
          VELORA sample catalogue. No live orders.
        </div>
      </footer>
      <MobileDock />
      <CartDrawer />
      <SearchPanel />
      <AccountPanel />
      <MenuPanel />
      <QuickView />
      <div className="sr-only" aria-live="polite">
        {notice}
      </div>
      {notice && <div className="toast">{notice}</div>}
    </div>
  );
}
