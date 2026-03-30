"use client";

import type { MenuProduct } from "@/data/menu";
import { useCartStore } from "@/store/useCartStore";
import { Plus } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";

export function ProductCard({ product }: { product: MenuProduct }) {
  const add = useCartStore((s) => s.add);

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <ProductImage product={product} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-zinc-900">
                {product.name}
              </h3>
              <p className="mt-0.5 line-clamp-1 text-sm text-zinc-500">
                {product.description}
              </p>
            </div>
            <button
              type="button"
              aria-label={`Agregar ${product.name} al carrito`}
              onClick={() => add(product)}
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-webcai-red text-white shadow-sm active:scale-[0.98]"
            >
              <Plus className="size-5" />
            </button>
          </div>
          <div className="mt-2 text-sm font-semibold text-webcai-red">
            ${product.price}
          </div>
        </div>
      </div>
    </article>
  );
}

