"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrencyMXN } from "@/components/ui/format";

export default function ReceiptPage() {
  const params = useParams<{ orderId: string }>();
  const orderIdFromRoute = decodeURIComponent(params?.orderId ?? "");

  const receipt = useCartStore((s) => s.lastReceipt);

  const safeOrderId = useMemo(() => {
    if (receipt?.orderId) return receipt.orderId;
    return orderIdFromRoute;
  }, [receipt?.orderId, orderIdFromRoute]);

  const displayOrder = safeOrderId.startsWith("#")
    ? safeOrderId
    : `#${safeOrderId}`;

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-[#fdfcf8] px-4 py-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-8 shrink-0 text-[#FF5700]" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-zinc-900">
              Recibo
            </h1>
            <p className="text-sm text-zinc-500">Pago simulado completado.</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Número de orden
          </div>
          <div className="mt-1 font-mono text-xl font-bold tracking-tight text-zinc-900">
            {displayOrder || "#HK-—"}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Tu pedido
          </h2>
          {receipt?.items?.length ? (
            <ul className="space-y-2">
              {receipt.items.map((line) => (
                <li
                  key={line.lineId}
                  className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm leading-snug text-zinc-900"
                >
                  <span className="font-medium">
                    {line.qty}× {line.name}
                  </span>
                  <span className="text-zinc-500"> — </span>
                  <span className="font-semibold tabular-nums">
                    {formatCurrencyMXN(line.price * line.qty)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-600">
              No hay detalle en memoria; la orden quedó registrada.
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-zinc-200 pt-4">
          <span className="text-sm font-semibold text-zinc-700">Total</span>
          <span className="text-xl font-extrabold tabular-nums text-zinc-900">
            {formatCurrencyMXN(receipt?.total ?? 0)}
          </span>
        </div>

        <p className="mt-5 border-t border-zinc-100 pt-4 text-center text-sm leading-relaxed text-zinc-600">
          Las bolas están bañadas con salsa de anguila y chipotle.
        </p>

        <Link
          href="/"
          onClick={() => useCartStore.getState().clearAll()}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#FF5700] text-sm font-bold text-white shadow-sm active:scale-[0.99]"
        >
          Nueva orden
        </Link>
      </div>
    </div>
  );
}
