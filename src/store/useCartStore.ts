import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuProduct } from "@/data/menu";

export type CartLine = {
  lineId: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  /** `true` con verdura, `false` sin; `null` en extras */
  withVegetables: boolean | null;
};

export type Receipt = {
  orderId: string;
  items: CartLine[];
  total: number;
  paidAtIso: string;
  method: "tarjeta" | "paypal";
};

function lineIdFor(product: MenuProduct, withVegetables?: boolean) {
  if (product.requiresVegetableOption) {
    const v = withVegetables ?? true;
    return `${product.id}__${v ? "veg" : "noveg"}`;
  }
  return product.id;
}

function displayNameForLine(
  product: MenuProduct,
  withVegetables: boolean | null,
): string {
  if (!product.requiresVegetableOption || withVegetables === null) {
    return product.name;
  }
  return withVegetables
    ? `${product.name} (Con verdura)`
    : `${product.name} (Sin verdura)`;
}

type CartState = {
  isCartOpen: boolean;
  step: "cart" | "checkout";
  paymentMethod: "tarjeta" | "paypal";
  itemsById: Record<string, CartLine>;
  lastReceipt: Receipt | null;

  openCart: () => void;
  closeCart: () => void;
  goToCart: () => void;
  goToCheckout: () => void;
  setPaymentMethod: (m: "tarjeta" | "paypal") => void;

  add: (product: MenuProduct, withVegetables?: boolean) => void;
  inc: (lineId: string) => void;
  dec: (lineId: string) => void;
  remove: (lineId: string) => void;
  clearCart: () => void;
  clearAll: () => void;

  createReceiptFromCart: (method: "tarjeta" | "paypal") => Receipt;
  setReceipt: (receipt: Receipt) => void;
};

function calcTotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
}

function randomHakunaOrderId() {
  const n = 100 + Math.floor(Math.random() * 900);
  return `HK-${n}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isCartOpen: false,
      step: "cart",
      paymentMethod: "tarjeta",
      itemsById: {},
      lastReceipt: null,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false, step: "cart" }),
      goToCart: () => set({ step: "cart" }),
      goToCheckout: () => set({ step: "checkout" }),
      setPaymentMethod: (m) => set({ paymentMethod: m }),

      add: (product, withVegetables) =>
        set((s) => {
          const veg: boolean | null = product.requiresVegetableOption
            ? (withVegetables ?? true)
            : null;
          const lineId = lineIdFor(
            product,
            veg === null ? undefined : veg,
          );
          const existing = s.itemsById[lineId];
          const next: Record<string, CartLine> = { ...s.itemsById };
          if (existing) {
            next[lineId] = { ...existing, qty: existing.qty + 1 };
          } else {
            next[lineId] = {
              lineId,
              productId: product.id,
              name: displayNameForLine(product, veg),
              price: product.price,
              qty: 1,
              withVegetables: veg,
            };
          }
          return { itemsById: next, isCartOpen: true };
        }),

      inc: (lineId) =>
        set((s) => {
          const existing = s.itemsById[lineId];
          if (!existing) return s;
          return {
            itemsById: {
              ...s.itemsById,
              [lineId]: { ...existing, qty: existing.qty + 1 },
            },
          };
        }),

      dec: (lineId) =>
        set((s) => {
          const existing = s.itemsById[lineId];
          if (!existing) return s;
          const next = { ...s.itemsById };
          const qty = existing.qty - 1;
          if (qty <= 0) delete next[lineId];
          else next[lineId] = { ...existing, qty };
          return { itemsById: next };
        }),

      remove: (lineId) =>
        set((s) => {
          const n = { ...s.itemsById };
          delete n[lineId];
          return { itemsById: n };
        }),

      clearCart: () => set({ itemsById: {}, step: "cart" }),
      clearAll: () => set({ itemsById: {}, step: "cart", lastReceipt: null }),

      createReceiptFromCart: (method) => {
        const items = Object.values(get().itemsById);
        const total = calcTotal(items);
        return {
          orderId: randomHakunaOrderId(),
          items,
          total,
          paidAtIso: new Date().toISOString(),
          method,
        };
      },
      setReceipt: (receipt) => set({ lastReceipt: receipt }),
    }),
    {
      name: "hakuna-bolas-cart",
      skipHydration: true,
      partialize: (s) => ({
        itemsById: s.itemsById,
        lastReceipt: s.lastReceipt,
        paymentMethod: s.paymentMethod,
      }),
    },
  ),
);
