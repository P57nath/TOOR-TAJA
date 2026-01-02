"use client";

import FormField from "@/components/forms/FormField";
import { resetPassword, resetPasswordSchema } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export const dynamic = "force-static";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inputClassName = (hasError?: string) =>
    `mt-2 w-full border-b bg-transparent pb-2 text-sm text-emerald-950 outline-none ${
      hasError
        ? "border-rose-400 focus:border-rose-500"
        : "border-emerald-200 focus:border-emerald-500"
    }`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    const parsed = resetPasswordSchema.safeParse({ token, password });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const nextErrors: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value?.length) nextErrors[key] = value[0];
      });
      setErrors(nextErrors);
      setStatus("idle");
      return;
    }

    try {
      await resetPassword(parsed.data);
      setStatus("success");
      setMessage("Password updated. You can sign in now.");
    } catch (error) {
      setStatus("idle");
      setErrors({
        form: error instanceof Error ? error.message : "Reset failed.",
      });
    }
  }

  return (
    <main className="mx-auto flex h-screen w-full max-w-6xl items-start justify-center overflow-hidden px-6 pt-6 pb-6">
      <section className="w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-900/10 bg-white shadow-lg">
        <div className="flex flex-col justify-center gap-4 p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/toortaja-logo.png"
                width={28}
                height={28}
                alt="Toor-Taja logo"
                className="h-7 w-7 object-contain"
              />
              <h2 className="text-lg font-semibold text-emerald-950">
                ToorTaja
              </h2>
            </div>
            <p className="text-xs text-emerald-900/70">
              Set a new password to complete your reset.
            </p>
          </div>

          {!token ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Missing or invalid reset token. Please request a new reset link.
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField
              id="reset-password"
              label="New password"
              error={errors.password}
            >
              <input
                id="reset-password"
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                className={inputClassName(errors.password)}
                autoComplete="new-password"
                required
              />
            </FormField>

            {errors.form ? (
              <p className="text-sm text-rose-600">{errors.form}</p>
            ) : null}
            {message ? (
              <p
                className={`text-sm ${
                  status === "success" ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {message}
              </p>
            ) : null}

            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-60"
              type="submit"
              disabled={status === "loading" || !token}
            >
              {status === "loading" ? "Updating..." : "Update password"}
            </button>
          </form>

          <div className="text-center text-xs text-emerald-900/70">
            Need a new link?{" "}
            <Link className="font-semibold text-emerald-700" href="/forgot-password">
              Request again
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
