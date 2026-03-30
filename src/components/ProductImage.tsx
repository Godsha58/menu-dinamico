"use client";

import { Salad, Sandwich, Soup } from "lucide-react";
import type { MenuProduct } from "@/data/menu";

export function ProductImage({ product }: { product: MenuProduct }) {
  const base =
    "grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br shadow-sm";

  if (product.imageKey === "guacamole") {
    return (
      <div className={`${base} from-emerald-100 to-lime-100`}>
        <Soup className="size-7 text-emerald-700" />
      </div>
    );
  }
  if (product.imageKey === "ensalada") {
    return (
      <div className={`${base} from-green-100 to-emerald-100`}>
        <Salad className="size-7 text-green-700" />
      </div>
    );
  }
  if (product.imageKey === "hamburguesa") {
    return (
      <div className={`${base} from-amber-100 to-orange-100`}>
        <Sandwich className="size-7 text-amber-800" />
      </div>
    );
  }
  return (
    <div className={`${base} from-rose-100 to-orange-100`}>
      <Soup className="size-7 text-rose-700" />
    </div>
  );
}

