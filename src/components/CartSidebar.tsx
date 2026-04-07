"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, Trash2, X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "@/store/useCartStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { cn } from "@/components/ui/cn";
import { formatCurrencyMXN } from "@/components/ui/format";
import { FormField } from "@/components/ui/FormField";

function CartRow({
  lineId,
  name,
  price,
  qty,
}: {
  lineId: string;
  name: string;
  price: number;
  qty: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-semibold leading-snug text-zinc-900">
            {name}
          </div>
          <div className="mt-1 text-sm text-zinc-500">
            {formatCurrencyMXN(price)} c/u · Subtotal{" "}
            <span className="font-semibold text-zinc-900">
              {formatCurrencyMXN(price * qty)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => useCartStore.getState().dec(lineId)}
              className="grid size-9 place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-800 active:scale-[0.98]"
              aria-label={`Disminuir ${name}`}
            >
              −
            </button>
            <div className="min-w-8 text-center text-sm font-semibold text-zinc-900">
              {qty}
            </div>
            <button
              type="button"
              onClick={() => useCartStore.getState().inc(lineId)}
              className="grid size-9 place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-800 active:scale-[0.98]"
              aria-label={`Aumentar ${name}`}
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => useCartStore.getState().remove(lineId)}
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-zinc-100 text-[#FF5700] active:scale-[0.98]"
          aria-label={`Eliminar ${name}`}
        >
          <Trash2 className="size-5" />
        </button>
      </div>
    </div>
  );
}

function PaymentMethodButton({
  title,
  selected,
  onSelect,
}: {
  title: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-12 w-full items-center justify-between rounded-2xl border px-4 text-left",
        selected
          ? "border-[#FF5700] bg-[#FF5700]/8"
          : "border-zinc-200 bg-white",
      )}
    >
      <span className="text-sm font-semibold text-zinc-900">{title}</span>
      <span
        className={cn(
          "size-4 rounded-full border",
          selected ? "border-[#FF5700] bg-[#FF5700]" : "border-zinc-300",
        )}
        aria-hidden
      />
    </button>
  );
}

export function CartSidebar() {
  const router = useRouter();

  const { isOpen, step, paymentMethod, itemsById } = useCartStore(
    useShallow((s) => ({
      isOpen: s.isCartOpen,
      step: s.step,
      paymentMethod: s.paymentMethod,
      itemsById: s.itemsById,
    })),
  );
  const items = useMemo(() => Object.values(itemsById), [itemsById]);
  const total = useMemo(
    () => items.reduce((sum, l) => sum + l.price * l.qty, 0),
    [items],
  );

  const [isPaying, setIsPaying] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [nameError, setNameError] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [ppAccount, setPpAccount] = useState("");
  const [ppPass, setPpPass] = useState("");

  const formattedTotal = useMemo(() => formatCurrencyMXN(total), [total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") useCartStore.getState().closeCart();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  async function payNow() {
    if (!items.length || isPaying) return;
    const trimmedCustomerName = customerName.trim();
    if (!trimmedCustomerName) {
      setNameError("El nombre del cliente es obligatorio.");
      return;
    }

    setIsPaying(true);
    await new Promise((r) => setTimeout(r, 2000));
    const st = useCartStore.getState();
    const receipt = st.createReceiptFromCart(paymentMethod, trimmedCustomerName);
    const restaurantStore = useRestaurantStore.getState();
    restaurantStore.setCart(receipt.items);
    restaurantStore.addOrder({
      id: receipt.orderId,
      customerName: trimmedCustomerName,
      items: receipt.items,
      total: receipt.total,
    });
    restaurantStore.clearCart();
    st.setReceipt(receipt);
    st.clearCart();
    st.closeCart();
    setIsPaying(false);
    setNameError("");
    router.push(`/recibo/${encodeURIComponent(receipt.orderId)}`);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={() => useCartStore.getState().closeCart()}
        aria-label="Cerrar"
      />

      <aside className="absolute right-0 top-0 flex h-full w-[92vw] max-w-md flex-col bg-zinc-50 shadow-2xl">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-zinc-200 bg-white">
            <div className="flex items-center justify-between px-4 pt-4">
              <div className="leading-tight">
                <div className="text-base font-semibold text-zinc-900">
                  Hakuna Bolas de Arroz
                </div>
                <div className="text-sm font-bold text-[#FF5700]">
                  {step === "cart" ? "Tu pedido" : "Pago simulado"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => useCartStore.getState().closeCart()}
                className="grid size-10 place-items-center rounded-xl bg-zinc-100 text-zinc-800 active:scale-[0.98]"
                aria-label="Cerrar"
              >
                <X className="size-5" />
              </button>
            </div>

            {step === "checkout" ? (
              <div className="px-4 pb-3 pt-3">
                <button
                  type="button"
                  onClick={() => useCartStore.getState().goToCart()}
                  className="text-sm font-semibold text-zinc-700 underline decoration-zinc-300 underline-offset-4"
                >
                  Volver al carrito
                </button>
              </div>
            ) : (
              <div className="px-4 pb-3 pt-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {items.length ? "Resumen" : "Sin artículos"}
                </div>
              </div>
            )}
          </div>

          {step === "cart" ? (
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain px-4 pb-[max(11rem,env(safe-area-inset-bottom,0px)+9.5rem)]">
              {items.map((l) => (
                <CartRow
                  key={l.lineId}
                  lineId={l.lineId}
                  name={l.name}
                  price={l.price}
                  qty={l.qty}
                />
              ))}
              {!items.length ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
                  Agrega productos con el botón{" "}
                  <span className="font-bold">+</span> para comenzar.
                </div>
              ) : null}
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-[max(15rem,env(safe-area-inset-bottom,0px)+13.5rem)]">
              <div className="space-y-3 pb-2">
                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Total a pagar
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-zinc-900">
                    {formattedTotal}
                  </div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <FormField
                    label="Nombre del cliente"
                    placeholder="Ej. Daniel"
                    autoComplete="name"
                    value={customerName}
                    onChange={(v) => {
                      setCustomerName(v);
                      if (nameError) setNameError("");
                    }}
                  />
                  {nameError ? (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {nameError}
                    </p>
                  ) : null}
                </div>

                <PaymentMethodButton
                  title="Tarjeta"
                  selected={paymentMethod === "tarjeta"}
                  onSelect={() =>
                    useCartStore.getState().setPaymentMethod("tarjeta")
                  }
                />
                <PaymentMethodButton
                  title="PayPal"
                  selected={paymentMethod === "paypal"}
                  onSelect={() =>
                    useCartStore.getState().setPaymentMethod("paypal")
                  }
                />

                <div className="mt-2 rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    {paymentMethod === "tarjeta"
                      ? "Datos de tarjeta (demo)"
                      : "Cuenta PayPal (demo)"}
                  </div>
                  <div className="mt-4 space-y-3">
                    {paymentMethod === "tarjeta" ? (
                      <>
                        <FormField
                          label="nombre"
                          placeholder="Tu nombre"
                          autoComplete="cc-name"
                          value={cardName}
                          onChange={setCardName}
                        />
                        <FormField
                          label="tarjeta"
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          value={cardNumber}
                          onChange={setCardNumber}
                          rightAdornment={<CreditCard className="size-5" />}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            label="fecha"
                            placeholder="04/27"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            value={cardExp}
                            onChange={setCardExp}
                          />
                          <FormField
                            label="CVV"
                            placeholder="123"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            value={cardCvv}
                            onChange={setCardCvv}
                            type="password"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <FormField
                          label="cuenta"
                          placeholder="correo@ejemplo.com"
                          autoComplete="username"
                          value={ppAccount}
                          onChange={setPpAccount}
                        />
                        <FormField
                          label="contraseña"
                          placeholder="••••••••"
                          autoComplete="current-password"
                          type="password"
                          value={ppPass}
                          onChange={setPpPass}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 right-0 w-[92vw] max-w-md">
            <div className="bg-white px-4 pb-5 pt-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-800">Total</div>
                <div className="text-lg font-extrabold text-zinc-900">
                  {formattedTotal}
                </div>
              </div>

              {step === "cart" ? (
                <button
                  type="button"
                  onClick={() => useCartStore.getState().goToCheckout()}
                  disabled={!items.length}
                  className={cn(
                    "mt-3 h-12 w-full rounded-2xl bg-[#FF5700] text-sm font-bold text-white shadow-sm active:scale-[0.99]",
                    !items.length ? "opacity-50" : "",
                  )}
                >
                  Ir a pago · {formattedTotal}
                </button>
              ) : (
                <div className="mt-3 grid gap-2">
                  <button
                    type="button"
                    onClick={payNow}
                    disabled={!items.length || isPaying || !customerName.trim()}
                    className={cn(
                      "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5700] text-sm font-bold text-white shadow-sm active:scale-[0.99]",
                      isPaying || !customerName.trim() ? "opacity-90" : "",
                    )}
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Procesando…
                      </>
                    ) : (
                      <>Pagar {formattedTotal}</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => useCartStore.getState().closeCart()}
                    className="h-12 w-full rounded-2xl border border-zinc-200 bg-white text-sm font-bold text-zinc-900 active:scale-[0.99]"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
