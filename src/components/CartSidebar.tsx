"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, Trash2, X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/components/ui/cn";
import { formatCurrencyMXN } from "@/components/ui/format";
import { FormField } from "@/components/ui/FormField";

function CartRow({
  id,
  name,
  price,
  qty,
}: {
  id: string;
  name: string;
  price: number;
  qty: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold text-zinc-900">
            {name}
          </div>
          <div className="mt-1 text-sm text-zinc-500">
            {formatCurrencyMXN(price)} · Subtotal{" "}
            <span className="font-semibold text-zinc-900">
              {formatCurrencyMXN(price * qty)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => useCartStore.getState().dec(id)}
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
              onClick={() => useCartStore.getState().inc(id)}
              className="grid size-9 place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-800 active:scale-[0.98]"
              aria-label={`Aumentar ${name}`}
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => useCartStore.getState().remove(id)}
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-zinc-100 text-webcai-red active:scale-[0.98]"
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
          ? "border-webcai-red bg-webcai-red/5"
          : "border-zinc-200 bg-white",
      )}
    >
      <span className="text-sm font-semibold text-zinc-900">{title}</span>
      <span
        className={cn(
          "size-4 rounded-full border",
          selected ? "border-webcai-red bg-webcai-red" : "border-zinc-300",
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
    setIsPaying(true);
    await new Promise((r) => setTimeout(r, 2000));
    const st = useCartStore.getState();
    const receipt = st.createReceiptFromCart(paymentMethod);
    st.setReceipt(receipt);
    st.clearCart();
    st.closeCart();
    setIsPaying(false);
    router.push(`/recibo/${receipt.orderId}`);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        onClick={() => useCartStore.getState().closeCart()}
        aria-label="Cerrar"
      />

      <aside className="absolute right-0 top-0 h-full w-[92vw] max-w-md bg-zinc-50 shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="bg-white">
            <div className="flex items-center justify-between px-4 pt-4">
              <div className="leading-tight">
                <div className="text-base font-semibold text-zinc-900">
                  Menú Digital
                </div>
                <div className="text-sm font-semibold text-webcai-red">
                  {step === "cart" ? "Carrito" : "Metodo de Pago"}
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
                  {items.length ? "Artículos agregados" : "Sin artículos"}
                </div>
              </div>
            )}
          </div>

          {step === "cart" ? (
            <div className="flex-1 space-y-3 overflow-auto px-4 pb-28">
              {items.map((l) => (
                <CartRow
                  key={l.productId}
                  id={l.productId}
                  name={l.name}
                  price={l.price}
                  qty={l.qty}
                />
              ))}
              {!items.length ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
                  Agrega productos con el botón <span className="font-bold">+</span>{" "}
                  para comenzar.
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex-1 overflow-auto px-4 pb-32">
              <div className="space-y-3">
                <PaymentMethodButton
                  title="Tarjeta"
                  selected={paymentMethod === "tarjeta"}
                  onSelect={() => useCartStore.getState().setPaymentMethod("tarjeta")}
                />
                <PaymentMethodButton
                  title="PayPal"
                  selected={paymentMethod === "paypal"}
                  onSelect={() => useCartStore.getState().setPaymentMethod("paypal")}
                />

                <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    {paymentMethod === "tarjeta"
                      ? "Formulario de tarjeta"
                      : "Formulario de paypal"}
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
                    "mt-3 h-12 w-full rounded-2xl bg-webcai-red text-sm font-bold text-white shadow-sm active:scale-[0.99]",
                    !items.length ? "opacity-50" : "",
                  )}
                >
                  Pagar {formattedTotal}
                </button>
              ) : (
                <div className="mt-3 grid gap-2">
                  <button
                    type="button"
                    onClick={payNow}
                    disabled={!items.length || isPaying}
                    className={cn(
                      "flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-webcai-red text-sm font-bold text-white shadow-sm active:scale-[0.99]",
                      isPaying ? "opacity-80" : "",
                    )}
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Procesando…
                      </>
                    ) : (
                      <>Pagar Ahora ({formattedTotal})</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => useCartStore.getState().closeCart()}
                    className="h-12 w-full rounded-2xl border border-zinc-200 bg-white text-sm font-bold text-zinc-900 active:scale-[0.99]"
                  >
                    Aceptar
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

