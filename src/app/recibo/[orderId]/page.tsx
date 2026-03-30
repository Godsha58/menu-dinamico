"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { CheckCircle2, ReceiptText } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrencyMXN } from "@/components/ui/format";

export default function ReceiptPage() {
  const params = useParams<{ orderId: string }>();
  const orderIdFromRoute = params?.orderId ?? "";

  const receipt = useCartStore((s) => s.lastReceipt);
  const clearAll = useCartStore((s) => s.clearAll);

  const safeOrderId = useMemo(() => {
    if (receipt?.orderId) return receipt.orderId;
    return orderIdFromRoute;
  }, [receipt?.orderId, orderIdFromRoute]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-zinc-50 px-4 py-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-8 text-webcai-red" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-zinc-900">
              Pago exitoso
            </h1>
            <p className="text-sm text-zinc-500">Tu pedido fue confirmado.</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <ReceiptText className="size-4" />
            Orden
          </div>
          <div className="mt-1 text-base font-bold text-zinc-900">
            {safeOrderId || "ORD-PENDIENTE"}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Productos
          </h2>
          {receipt?.items?.length ? (
            <div className="space-y-2">
              {receipt.items.map((line) => (
                <div
                  key={line.productId}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2"
                >
                  <span className="text-sm font-medium text-zinc-900">
                    {line.name} x{line.qty}
                  </span>
                  <span className="text-sm font-semibold text-zinc-900">
                    {formatCurrencyMXN(line.price * line.qty)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-600">
              No hay detalle en memoria, pero la orden fue creada.
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-zinc-200 pt-4">
          <span className="text-sm font-semibold text-zinc-700">Total pagado</span>
          <span className="text-xl font-extrabold text-zinc-900">
            {formatCurrencyMXN(receipt?.total ?? 0)}
          </span>
        </div>

        <Link
          href="/"
          onClick={clearAll}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-webcai-red text-sm font-bold text-white shadow-sm"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

