"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { CartSidebar } from "@/components/CartSidebar";
import type { MenuProduct, MenuSection } from "@/data/menu";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrencyMXN } from "@/components/ui/format";

type SectionBlock = {
  section: MenuSection;
  products: MenuProduct[];
};

export function HomeMenuClient({ sections }: { sections: SectionBlock[] }) {
  const itemsById = useCartStore((s) => s.itemsById);
  const items = useMemo(() => Object.values(itemsById), [itemsById]);
  const itemCount = useMemo(
    () => items.reduce((acc, line) => acc + line.qty, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((sum, l) => sum + l.price * l.qty, 0),
    [items],
  );

  const [activeSectionId, setActiveSectionId] = useState<string>(
    () => sections[0]?.section.id ?? "",
  );

  useEffect(() => {
    const elements = sections
      .map(({ section }) =>
        document.getElementById(`menu-section-${section.id}`),
      )
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visible[0].target.getAttribute("data-section-id");
        if (id) setActiveSectionId((prev) => (prev === id ? prev : id));
      },
      {
        root: null,
        rootMargin: "-100px 0px -52% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const navSections = useMemo(
    () =>
      sections.map(({ section }) => ({
        id: section.id,
        title: section.navLabel,
      })),
    [sections],
  );

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-[#fdfcf8] pb-24">
      <Header
        sections={navSections}
        activeSectionId={activeSectionId}
        onSectionChange={setActiveSectionId}
      />

      <main className="space-y-8 px-4 pb-8 pt-4">
        {sections.map(({ section, products }) => (
          <section
            key={section.id}
            id={`menu-section-${section.id}`}
            data-section-id={section.id}
            className="scroll-mt-[8.5rem] space-y-3"
          >
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
              {section.title}
            </h2>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ))}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/25 bg-[#FF5700] shadow-[0_-8px_24px_rgba(0,0,0,0.12)]">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => useCartStore.getState().openCart()}
            className="min-h-12 flex-1 rounded-xl bg-white/15 px-4 text-left text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur-sm active:scale-[0.99]"
          >
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/90">
              Ver pedido
            </span>
            {itemCount > 0 ? (
              <span className="text-xs font-medium text-white/85">
                {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
              </span>
            ) : (
              <span className="text-xs font-medium text-white/75">
                Carrito vacío
              </span>
            )}
          </button>
          <div className="shrink-0 text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
              Total
            </div>
            <div className="text-lg font-extrabold tabular-nums text-white">
              {formatCurrencyMXN(subtotal)}
            </div>
          </div>
        </div>
      </div>

      <CartSidebar />
    </div>
  );
}
