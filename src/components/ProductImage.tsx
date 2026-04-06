"use client";

import Image from "next/image";
import type { MenuProduct } from "@/data/menu";

const productImageSrc: Record<MenuProduct["imageKey"], string> = {
  "bola-pollo": "/products/bola-pollo.png",
  "bola-camaron": "/products/bola-camaron.png",
  "bola-res": "/products/bola-res.png",
  papas: "/products/papas.png",
  aros: "/products/aros.png",
  refresco: "/products/refresco.png",
};

const frameClass =
  "relative size-[4.5rem] shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md bg-zinc-100";

export function ProductImage({ product }: { product: MenuProduct }) {
  const src = productImageSrc[product.imageKey];

  return (
    <div className={frameClass}>
      <Image
        src={src}
        alt={product.name}
        fill
        className="object-cover"
        sizes="72px"
        priority={false}
      />
    </div>
  );
}
