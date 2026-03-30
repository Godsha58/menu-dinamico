"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center">
      <h1 className="text-lg font-bold text-zinc-900">Error al cargar la app</h1>
      <p className="text-sm text-zinc-600">
        {error.message || "Revisa la consola del navegador (F12) para más detalle."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-2xl bg-webcai-red px-6 py-3 text-sm font-bold text-white"
      >
        Reintentar
      </button>
    </div>
  );
}
