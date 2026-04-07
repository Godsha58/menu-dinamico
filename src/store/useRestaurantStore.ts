import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/store/useCartStore";

export type RestaurantOrder = {
  id: string;
  customerName: string;
  items: CartLine[];
  total: number;
  status: "pendiente" | "entregado";
  createdAt: string;
};

type RestaurantState = {
  cart: CartLine[];
  orders: RestaurantOrder[];
  setCart: (items: CartLine[]) => void;
  addOrder: (order: Omit<RestaurantOrder, "status" | "createdAt">) => void;
  completeOrder: (orderId: string) => void;
  clearCart: () => void;
};

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set) => ({
      cart: [],
      orders: [],
      setCart: (items) => set({ cart: items }),
      addOrder: (order) =>
        set((s) => ({
          orders: [
            ...s.orders,
            {
              ...order,
              status: "pendiente",
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      completeOrder: (orderId) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId ? { ...o, status: "entregado" } : o,
          ),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "hakuna-restaurant-store",
      skipHydration: true,
      partialize: (s) => ({
        cart: s.cart,
        orders: s.orders,
      }),
    },
  ),
);
