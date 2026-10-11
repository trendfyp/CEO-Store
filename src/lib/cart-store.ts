import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProductById, variantOf, type Product } from "@/data/catalog";

export type CartLine = {
  productId: string;
  variantId: string;
  qty: number;
};

type AddResult =
  | { ok: true; clamped: boolean; stock: number }
  | { ok: false; reason: string };

type CartState = {
  lines: CartLine[];
  favorites: string[];
  add: (productId: string, variantId: string, qty?: number) => AddResult;
  setQty: (productId: string, variantId: string, qty: number) => AddResult;
  remove: (productId: string, variantId: string) => void;
  clear: () => void;
  toggleFavorite: (productId: string) => void;
};

function isLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as CartLine;
  return (
    typeof line.productId === "string" &&
    typeof line.variantId === "string" &&
    Number.isInteger(line.qty) &&
    line.qty > 0
  );
}

function clampLine(line: CartLine): CartLine | null {
  const product = getProductById(line.productId);
  const variant = product ? variantOf(product, line.variantId) : undefined;
  if (!product || !variant || variant.stock < 1) return null;
  return { ...line, qty: Math.min(line.qty, variant.stock) };
}

export function lineStock(product: Product, variantId: string) {
  return variantOf(product, variantId)?.stock ?? 0;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      favorites: [],
      add: (productId, variantId, qty = 1) => {
        const product = getProductById(productId);
        const variant = product ? variantOf(product, variantId) : undefined;
        if (!product || !variant) return { ok: false, reason: "That piece is not in the catalogue." };
        if (!Number.isInteger(qty) || qty < 1) return { ok: false, reason: "Quantity must be at least 1." };
        if (variant.stock < 1) return { ok: false, reason: `${variant.label} is not available in this sample.` };

        const lines = get().lines;
        const existing = lines.find((line) => line.productId === productId && line.variantId === variantId);
        const nextQty = Math.min((existing?.qty ?? 0) + qty, variant.stock);
        if (existing && existing.qty >= variant.stock) {
          return {
            ok: false,
            reason: `Only ${variant.stock} available in this sample catalogue.`,
          };
        }
        const next = existing
          ? lines.map((line) =>
              line.productId === productId && line.variantId === variantId ? { ...line, qty: nextQty } : line,
            )
          : [...lines, { productId, variantId, qty: nextQty }];
        set({ lines: next });
        return { ok: true, clamped: (existing?.qty ?? 0) + qty > variant.stock, stock: variant.stock };
      },
      setQty: (productId, variantId, qty) => {
        if (!Number.isInteger(qty)) return { ok: false, reason: "Quantity must be a whole number." };
        if (qty < 1) {
          get().remove(productId, variantId);
          return { ok: true, clamped: false, stock: 0 };
        }
        const product = getProductById(productId);
        const variant = product ? variantOf(product, variantId) : undefined;
        if (!product || !variant) return { ok: false, reason: "That piece is not in the catalogue." };
        if (variant.stock < 1) {
          get().remove(productId, variantId);
          return { ok: false, reason: `${variant.label} is not available in this sample.` };
        }
        const clamped = Math.min(qty, variant.stock);
        set({
          lines: get().lines.map((line) =>
            line.productId === productId && line.variantId === variantId ? { ...line, qty: clamped } : line,
          ),
        });
        return { ok: true, clamped: qty > variant.stock, stock: variant.stock };
      },
      remove: (productId, variantId) => {
        set({
          lines: get().lines.filter((line) => !(line.productId === productId && line.variantId === variantId)),
        });
      },
      clear: () => set({ lines: [] }),
      toggleFavorite: (productId) => {
        const favorites = get().favorites;
        set({
          favorites: favorites.includes(productId)
            ? favorites.filter((id) => id !== productId)
            : [...favorites, productId],
        });
      },
    }),
    {
      name: "velora-bag-v1",
      skipHydration: true,
      partialize: (state) => ({ lines: state.lines, favorites: state.favorites }),
      merge: (persisted, current) => {
        const saved = persisted as { lines?: unknown; favorites?: unknown } | undefined;
        const lines = Array.isArray(saved?.lines)
          ? saved.lines.filter(isLine).map(clampLine).filter((line): line is CartLine => line !== null)
          : [];
        const favorites = Array.isArray(saved?.favorites)
          ? saved.favorites.filter((id): id is string => typeof id === "string" && Boolean(getProductById(id)))
          : [];
        return { ...current, lines, favorites };
      },
    },
  ),
);

export function useBagCount(ready: boolean) {
  const lines = useCart((state) => state.lines);
  if (!ready) return 0;
  return lines.reduce((sum, line) => sum + line.qty, 0);
}

export function merchandiseOf(lines: CartLine[]) {
  return lines.reduce((sum, line) => {
    const product = getProductById(line.productId);
    if (!product) return sum;
    return sum + product.price * line.qty;
  }, 0);
}
