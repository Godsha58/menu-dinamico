"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

export function CartStoreRehydrate() {
  useEffect(() => {
    try {
      const p = useCartStore.persist;
      if (typeof p?.rehydrate === "function") {
        void p.rehydrate();
      }
    } catch {
      /* localStorage bloqueado (modo estricto / privado): la app sigue sin persistencia */
    }
  }, []);

  return null;
}
