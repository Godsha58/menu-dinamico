"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";

export function CartStoreRehydrate() {
  useEffect(() => {
    try {
      const p = useCartStore.persist;
      if (typeof p?.rehydrate === "function") {
        void p.rehydrate();
      }
      const rp = useRestaurantStore.persist;
      if (typeof rp?.rehydrate === "function") {
        void rp.rehydrate();
      }
    } catch {
      /* localStorage bloqueado (modo estricto / privado): la app sigue sin persistencia */
    }
  }, []);

  return null;
}
