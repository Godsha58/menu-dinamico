"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

export type HeaderNavSection = {
  id: string;
  title: string;
};

type HeaderProps = {
  sections: HeaderNavSection[];
  activeSectionId: string;
  onSectionChange: (sectionId: string) => void;
};

export function Header({
  sections,
  activeSectionId,
  onSectionChange,
}: HeaderProps) {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const listRef = useRef<HTMLDivElement>(null);

  const scrollTabIntoView = useCallback((id: string) => {
    const btn = tabRefs.current.get(id);
    const list = listRef.current;
    if (!btn || !list) return;
    const listRect = list.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const delta =
      btnRect.left + btnRect.width / 2 - (listRect.left + listRect.width / 2);
    list.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollTabIntoView(activeSectionId);
  }, [activeSectionId, scrollTabIntoView]);

  const handleSelect = (id: string) => {
    onSectionChange(id);
    const el = document.getElementById(`menu-section-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FF5700] shadow-sm">
      <div className="mx-auto w-full max-w-md px-4 pt-4 pb-3">
        <div className="flex justify-center">
          <Image
            src="/hakuna-logo.svg"
            alt="Hakuna Bolas de Arroz"
            width={220}
            height={56}
            className="h-12 w-auto max-w-[min(220px,82vw)] object-contain object-center brightness-0 invert"
            priority
            sizes="(max-width: 448px) 82vw, 220px"
          />
        </div>
      </div>

      <div
        ref={listRef}
        className="scrollbar-none flex gap-1 overflow-x-auto border-t border-white/20 bg-[#FF5700] px-3 py-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Categorías del menú"
      >
        {sections.map((s) => {
          const active = s.id === activeSectionId;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              ref={(node) => {
                if (node) tabRefs.current.set(s.id, node);
                else tabRefs.current.delete(s.id);
              }}
              onClick={() => handleSelect(s.id)}
              className="relative shrink-0 px-3 py-3 text-[12px] font-semibold tracking-wide text-white/85 transition-colors duration-200 hover:text-white data-[active=true]:text-white sm:text-[13px]"
              data-active={active}
            >
              <span className="whitespace-nowrap">{s.title}</span>
              <span
                className="pointer-events-none absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-white transition-opacity duration-200"
                style={{ opacity: active ? 1 : 0 }}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </header>
  );
}
