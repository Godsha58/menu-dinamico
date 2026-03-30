"use client";

import { cn } from "@/components/ui/cn";

type FormFieldProps = {
  label: string;
  placeholder?: string;
  type?: string;
  rightAdornment?: React.ReactNode;
  value?: string;
  onChange?: (v: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
};

export function FormField({
  label,
  placeholder,
  type = "text",
  rightAdornment,
  value,
  onChange,
  inputMode,
  autoComplete,
}: FormFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-zinc-800">{label}</span>
      <div className="relative">
        <input
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          inputMode={inputMode}
          autoComplete={autoComplete}
          type={type}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-100/80 px-4 text-[15px] text-zinc-900 outline-none",
            "placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-webcai-red/30",
            rightAdornment ? "pr-12" : "",
          )}
        />
        {rightAdornment ? (
          <div className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-zinc-500">
            {rightAdornment}
          </div>
        ) : null}
      </div>
    </label>
  );
}

