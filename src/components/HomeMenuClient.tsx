"use client";

import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { CartSidebar } from "@/components/CartSidebar";
import type { MenuProduct, MenuSection } from "@/data/menu";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

type SectionBlock = {
  section: MenuSection;
  products: MenuProduct[];
};

export function HomeMenuClient({ sections }: { sections: SectionBlock[] }) {
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) =>
    Object.values(s.itemsById).reduce((acc, line) => acc + line.qty, 0),
  );

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-zinc-50 pb-28">
      <Header subtitle="Entradas" />

      <main className="space-y-6 px-4 pb-8 pt-2">
        {sections.map(({ section, products }) => (
          <section key={section.id} className="space-y-3">
            {section.id !== "entradas" ? (
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                {section.title}
              </h2>
            ) : null}
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ))}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md px-4 pb-4">
        <button
          type="button"
          onClick={openCart}
          className="mx-auto flex h-14 w-full max-w-[220px] items-center justify-center gap-2 rounded-2xl bg-webcai-red text-lg font-extrabold text-white shadow-xl active:scale-[0.99]"
        >
          <ShoppingCart className="size-5" />
          Carrito
          {itemCount > 0 ? (
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-webcai-red">
              {itemCount}
            </span>
          ) : null}
        </button>
      </div>

      <CartSidebar />
    </div>
  );
}
