"use client";

import { useState } from "react";
import type { MenuProduct } from "@/data/menu";
import { useCartStore } from "@/store/useCartStore";
import { Plus } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { cn } from "@/components/ui/cn";

export function ProductCard({ product }: { product: MenuProduct }) {
  const [withVegetables, setWithVegetables] = useState(true);
  const needsVeg = Boolean(product.requiresVegetableOption);

  return (
    <article className="rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <ProductImage product={product} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold tracking-tight text-zinc-900">
                {product.name}
              </h3>
              <p className="mt-0.5 line-clamp-2 text-sm text-zinc-500">
                {product.description}
              </p>
              <div className="mt-1.5 text-sm font-bold text-[#FF5700]">
                ${product.price}
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:items-end">
              {needsVeg ? (
                <div className="w-full sm:w-auto">
                  <p
                    id={`veg-label-${product.id}`}
                    className="sr-only"
                  >
                    Verdura: con o sin
                  </p>
                  <div
                    className="flex w-full items-center gap-2 sm:min-w-[13.5rem]"
                    role="group"
                    aria-labelledby={`veg-label-${product.id}`}
                  >
                    <div className="flex min-h-10 min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => setWithVegetables(true)}
                        className={cn(
                          "min-h-9 flex-1 rounded-lg px-1.5 text-[11px] font-bold leading-tight transition-colors sm:px-2 sm:text-xs",
                          withVegetables
                            ? "bg-[#FF5700] text-white shadow-sm"
                            : "text-zinc-600",
                        )}
                      >
                        Con verdura
                      </button>
                      <button
                        type="button"
                        onClick={() => setWithVegetables(false)}
                        className={cn(
                          "min-h-9 flex-1 rounded-lg px-1.5 text-[11px] font-bold leading-tight transition-colors sm:px-2 sm:text-xs",
                          !withVegetables
                            ? "bg-[#FF5700] text-white shadow-sm"
                            : "text-zinc-600",
                        )}
                      >
                        Sin verdura
                      </button>
                    </div>
                    <button
                      type="button"
                      aria-label={`Agregar ${product.name} al carrito`}
                      onClick={() =>
                        useCartStore.getState().add(
                          product,
                          needsVeg ? withVegetables : undefined,
                        )
                      }
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-[#FF5700] text-white shadow-md active:scale-[0.97]"
                    >
                      <Plus className="size-5" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label={`Agregar ${product.name} al carrito`}
                  onClick={() => useCartStore.getState().add(product)}
                  className="grid size-10 place-items-center self-end rounded-full bg-[#FF5700] text-white shadow-md active:scale-[0.97] sm:self-end"
                >
                  <Plus className="size-5" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
