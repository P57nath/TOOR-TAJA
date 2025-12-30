import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

export default function FormField({
  id,
  label,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label
        className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700"
        htmlFor={id}
      >
        {label}
      </label>
      {children}
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
