"use client";

/* Route segment: `export const dynamic = "force-dynamic"` está en `admin/layout.tsx`
   porque este archivo es Client Component y Next no aplica ahí la config de segmento. */

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRestaurantStore, type RestaurantOrder } from "@/store/useRestaurantStore";
import { formatCurrencyMXN } from "@/components/ui/format";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const NEW_ORDER_SOUND_URL =
  "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

function orderAgeLabel(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.floor(ms / 60000));
  if (mins < 1) return "Justo ahora";
  if (mins === 1) return "1 min";
  return `${mins} min`;
}

function OrderDetailsModal({
  order,
  onClose,
}: {
  order: RestaurantOrder;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Cerrar detalles"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Orden #{order.id}</h3>
            <p className="text-sm text-zinc-600">
              Cliente: <span className="font-semibold">{order.customerName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-3 py-1.5 text-sm font-semibold text-zinc-700"
          >
            Cerrar
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {order.items.map((line) => (
            <li
              key={line.lineId}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-800"
            >
              <span className="font-semibold">
                {line.qty}x {line.name}
              </span>
              <span className="text-zinc-500"> — </span>
              <span className="font-semibold">
                {formatCurrencyMXN(line.price * line.qty)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const orders = useRestaurantStore((s) => s.orders);
  const completeOrder = useRestaurantStore((s) => s.completeOrder);
  const fetchPendingOrders = useRestaurantStore((s) => s.fetchPendingOrders);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeOrder, setActiveOrder] = useState<RestaurantOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === "pendiente"),
    [orders],
  );
  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.status === "entregado"),
    [orders],
  );

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(NEW_ORDER_SOUND_URL);
      audioRef.current.preload = "auto";
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        await fetchPendingOrders();
      } catch (error) {
        console.error("[admin:fetchPendingOrders] Supabase error:", error);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [fetchPendingOrders]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.warn(
        "[admin] Supabase no configurado: omite realtime hasta definir NEXT_PUBLIC_* en build.",
      );
      return;
    }

    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          const customerName = String(payload.new.customer_name ?? "nuevo cliente");
          setToastMessage(`¡Nueva orden de ${customerName}!`);
          window.setTimeout(() => setToastMessage(""), 3000);

          if (soundEnabled && audioRef.current) {
            void audioRef.current
              .play()
              .then(() => {
                if (audioRef.current) audioRef.current.currentTime = 0;
              })
              .catch(() => undefined);
          }

          try {
            await fetchPendingOrders();
          } catch (error) {
            console.error("[admin:realtime:fetchPendingOrders] Supabase error:", error);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchPendingOrders, soundEnabled]);

  async function enableSound() {
    if (!audioRef.current) audioRef.current = new Audio(NEW_ORDER_SOUND_URL);
    try {
      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setSoundEnabled(true);
    } catch {
      setSoundEnabled(false);
    }
  }

  async function onCompleteOrder(orderId: string) {
    try {
      await completeOrder(orderId);
    } catch (error) {
      console.error("[admin:completeOrder] Supabase error:", error);
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl bg-[#fdfcf8] pb-10">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-[#FF5700] px-4 py-4 shadow-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
          <Image
            src="/hakuna-logo.svg"
            alt="Hakuna"
            width={180}
            height={42}
            className="h-10 w-auto brightness-0 invert"
            priority
          />
          <button
            type="button"
            onClick={enableSound}
            className="rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white ring-1 ring-white/30"
          >
            {soundEnabled ? "Sonido activado" : "Activar sonido"}
          </button>
        </div>
      </header>

      {toastMessage ? (
        <div className="fixed right-4 top-20 z-50 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-xl">
          {toastMessage}
        </div>
      ) : null}

      <main className="grid gap-5 px-4 pt-5 md:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-lg font-extrabold tracking-tight text-zinc-900">
            Pendientes ({pendingOrders.length})
          </h2>
          {loading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              Cargando órdenes...
            </div>
          ) : pendingOrders.length ? (
            pendingOrders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                      #{order.id}
                    </p>
                    <h3 className="text-base font-bold text-zinc-900">
                      {order.customerName}
                    </h3>
                    <p className="text-sm text-zinc-600">
                      {order.items.length} item(s) · {orderAgeLabel(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right text-base font-extrabold text-[#FF5700]">
                    {formatCurrencyMXN(order.total)}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveOrder(order)}
                    className="h-10 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-800"
                  >
                    Ver detalles
                  </button>
                  <button
                    type="button"
                    onClick={() => void onCompleteOrder(order.id)}
                    className="h-10 rounded-xl bg-[#FF5700] text-sm font-bold text-white"
                  >
                    Dar salida
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              No hay órdenes pendientes.
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold tracking-tight text-zinc-900">
            Entregados ({deliveredOrders.length})
          </h2>
          {deliveredOrders.length ? (
            deliveredOrders
              .slice()
              .reverse()
              .map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    #{order.id}
                  </p>
                  <p className="text-base font-bold text-zinc-900">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-zinc-600">
                    {order.items.length} item(s) · {formatCurrencyMXN(order.total)}
                  </p>
                </article>
              ))
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
              Aún no hay órdenes entregadas.
            </div>
          )}
        </section>
      </main>

      <footer className="mx-4 mt-8 border-t border-zinc-200 pt-4 text-center text-sm text-zinc-600">
        Recuerda sonreír!
      </footer>

      {activeOrder ? (
        <OrderDetailsModal order={activeOrder} onClose={() => setActiveOrder(null)} />
      ) : null}
    </div>
  );
}
