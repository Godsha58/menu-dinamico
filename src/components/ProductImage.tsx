"use client";

import {
  Beef,
  CircleDot,
  GlassWater,
  Popcorn,
  Shrimp,
} from "lucide-react";
import type { MenuProduct } from "@/data/menu";

const base =
  "grid size-[4.5rem] shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white shadow-md";

export function ProductImage({ product }: { product: MenuProduct }) {
  switch (product.imageKey) {
    case "bola-pollo":
      return (
        <div className={`${base} bg-gradient-to-br from-orange-50 to-amber-100`}>
          <CircleDot className="size-8 text-[#FF5700]" strokeWidth={1.75} />
        </div>
      );
    case "bola-camaron":
      return (
        <div className={`${base} bg-gradient-to-br from-sky-50 to-orange-50`}>
          <Shrimp className="size-8 text-[#FF5700]" strokeWidth={1.75} />
        </div>
      );
    case "bola-res":
      return (
        <div className={`${base} bg-gradient-to-br from-rose-50 to-orange-50`}>
          <Beef className="size-8 text-[#FF5700]" strokeWidth={1.75} />
        </div>
      );
    case "papas":
      return (
        <div className={`${base} bg-gradient-to-br from-amber-50 to-yellow-100`}>
          <Popcorn className="size-8 text-amber-700" strokeWidth={1.75} />
        </div>
      );
    case "aros":
      return (
        <div className={`${base} bg-gradient-to-br from-violet-50 to-orange-50`}>
          <CircleDot className="size-8 text-violet-600" strokeWidth={1.75} />
        </div>
      );
    case "refresco":
    default:
      return (
        <div className={`${base} bg-gradient-to-br from-cyan-50 to-orange-50`}>
          <GlassWater className="size-8 text-cyan-600" strokeWidth={1.75} />
        </div>
      );
  }
}
