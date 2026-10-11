import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useUi } from "@/lib/ui-store";

export function useCommerceReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const mark = () => {
      if (!cancelled) setReady(true);
    };
    const unsub = useCart.persist.onFinishHydration(mark);
    if (useCart.persist.hasHydrated()) mark();
    void useCart.persist.rehydrate();
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);
  return ready;
}

export function useBagActions() {
  const add = useCart((state) => state.add);
  const notify = useUi((state) => state.notify);
  const open = useUi((state) => state.open);

  return {
    addToBag(productId: string, variantId: string, qty = 1, options?: { open?: boolean }) {
      const result = add(productId, variantId, qty);
      if (!result.ok) {
        notify(result.reason);
        return false;
      }
      notify(result.clamped ? `Only ${result.stock} in this sample. Bag updated.` : "Added to bag");
      if (options?.open !== false) open("cart");
      return true;
    },
  };
}
