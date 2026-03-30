"use client";

import { BellRing, Menu } from "lucide-react";

type HeaderProps = {
  title?: string;
  subtitle?: string;
  rightIcon?: "menu";
};

export function Header({
  title = "Web CAI 菜",
  subtitle,
  rightIcon = "menu",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20">
      <div className="bg-webcai-red text-white shadow-sm">
        <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-white/10">
              <BellRing className="size-5" />
            </span>
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight">
                {title}
              </div>
            </div>
          </div>
          {rightIcon === "menu" ? (
            <button
              type="button"
              aria-label="Abrir menú"
              className="grid size-10 place-items-center rounded-xl bg-white/10 active:scale-[0.98]"
            >
              <Menu className="size-6" />
            </button>
          ) : null}
        </div>
      </div>
      {subtitle ? (
        <div className="bg-white">
          <div className="mx-auto w-full max-w-md px-4 pt-4 pb-2">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              {subtitle}
            </h2>
          </div>
        </div>
      ) : null}
    </header>
  );
}

