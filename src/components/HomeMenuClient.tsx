"use client";

import { useEffect, useMemo, useState } from "react";
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
  const itemsById = useCartStore((s) => s.itemsById);
  const itemCount = useMemo(
    () => Object.values(itemsById).reduce((acc, line) => acc + line.qty, 0),
    [itemsById],
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
        rootMargin: "-88px 0px -52% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const navSections = useMemo(
    () => sections.map(({ section }) => ({ id: section.id, title: section.title })),
    [sections],
  );

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-28">
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
            className="scroll-mt-[7.5rem] space-y-3"
          >
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {section.title}
            </h2>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ))}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md px-4 pb-4">
        <button
          type="button"
          onClick={() => useCartStore.getState().openCart()}
          className="mx-auto flex h-14 w-full max-w-[220px] items-center justify-center gap-2 rounded-2xl bg-accent text-lg font-extrabold text-white shadow-xl active:scale-[0.99]"
        >
          <ShoppingCart className="size-5" />
          Carrito
          {itemCount > 0 ? (
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-accent">
              {itemCount}
            </span>
          ) : null}
        </button>
      </div>

      <CartSidebar />
    </div>
  );
}
