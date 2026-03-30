"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

export function CartStoreRehydrate() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
}
