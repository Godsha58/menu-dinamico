import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuProduct } from "@/data/menu";

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type Receipt = {
  orderId: string;
  items: CartLine[];
  total: number;
  paidAtIso: string;
  method: "tarjeta" | "paypal";
};

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

  add: (product: MenuProduct) => void;
  inc: (productId: string) => void;
  dec: (productId: string) => void;
  remove: (productId: string) => void;
  clearCart: () => void;
  clearAll: () => void;

  getItems: () => CartLine[];
  getCount: () => number;
  getTotal: () => number;
  createReceiptFromCart: (method: "tarjeta" | "paypal") => Receipt;
  setReceipt: (receipt: Receipt) => void;
};

function calcTotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
}

function randomOrderId() {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ORD-${now}-${rand}`;
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

      add: (product) =>
        set((s) => {
          const existing = s.itemsById[product.id];
          const next: Record<string, CartLine> = { ...s.itemsById };
          if (existing) {
            next[product.id] = { ...existing, qty: existing.qty + 1 };
          } else {
            next[product.id] = {
              productId: product.id,
              name: product.name,
              price: product.price,
              qty: 1,
            };
          }
          return { itemsById: next, isCartOpen: true };
        }),

      inc: (productId) =>
        set((s) => {
          const existing = s.itemsById[productId];
          if (!existing) return s;
          return {
            itemsById: {
              ...s.itemsById,
              [productId]: { ...existing, qty: existing.qty + 1 },
            },
          };
        }),

      dec: (productId) =>
        set((s) => {
          const existing = s.itemsById[productId];
          if (!existing) return s;
          const next = { ...s.itemsById };
          const qty = existing.qty - 1;
          if (qty <= 0) delete next[productId];
          else next[productId] = { ...existing, qty };
          return { itemsById: next };
        }),

      remove: (productId) =>
        set((s) => {
          const next = { ...s.itemsById };
          delete next[productId];
          return { itemsById: next };
        }),

      clearCart: () => set({ itemsById: {}, step: "cart" }),
      clearAll: () => set({ itemsById: {}, step: "cart", lastReceipt: null }),

      getItems: () => Object.values(get().itemsById),
      getCount: () =>
        Object.values(get().itemsById).reduce((sum, l) => sum + l.qty, 0),
      getTotal: () => calcTotal(Object.values(get().itemsById)),
      createReceiptFromCart: (method) => {
        const items = Object.values(get().itemsById);
        const total = calcTotal(items);
        return {
          orderId: randomOrderId(),
          items,
          total,
          paidAtIso: new Date().toISOString(),
          method,
        };
      },
      setReceipt: (receipt) => set({ lastReceipt: receipt }),
    }),
    {
      name: "webcai-cart",
      partialize: (s) => ({
        itemsById: s.itemsById,
        lastReceipt: s.lastReceipt,
        paymentMethod: s.paymentMethod,
      }),
    },
  ),
);

