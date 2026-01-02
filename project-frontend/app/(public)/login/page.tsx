"use client";

import FormField from "@/components/forms/FormField";
import { login, loginSchema } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const dynamic = "force-static";

type TokenPayload = {
  role?: string;
};

function getRoleFromToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "="));
    const data = JSON.parse(decoded) as TokenPayload;
    return data.role ? data.role.toLowerCase() : null;
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const router = useRouter();
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
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const parsed = loginSchema.safeParse({ email, password });
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

      const response = await login(parsed.data);
      setStatus("success");
      setMessage("Signed in successfully. Redirecting...");
      const role = getRoleFromToken(response.access_token);
      if (role === "buyer") {
        router.push("/buyer");
      } else if (role === "seller") {
        router.push("/seller");
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      setStatus("idle");
      setMessage("");
      setErrors({
        form: error instanceof Error ? error.message : "Login failed.",
      });
    }
  }

  return (
    <main className="mx-auto flex h-screen w-full max-w-6xl items-start justify-center overflow-hidden px-6 pt-10 pb-6">
      <section className="w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-900/10 bg-white shadow-lg">
        <div className="flex flex-col justify-center gap-6 p-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <Link className="flex items-center gap-2" href="/">
              <Image
                src="/toortaja-logo.png"
                width={36}
                height={36}
                alt="Toor-Taja logo"
                className="h-9 w-9 object-contain"
              />
              <h2 className="text-2xl font-semibold text-emerald-950">
                ToorTaja
              </h2>
            </Link>
            <p className="text-sm text-emerald-900/70">
              Sign in to track orders, manage baskets, and explore fresh picks.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              id="login-email"
              label="Email address"
              error={errors.email}
            >
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className={inputClassName(errors.email)}
                autoComplete="email"
                required
              />
            </FormField>
            <FormField
              id="login-password"
              label="Password"
              error={errors.password}
            >
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                className={inputClassName(errors.password)}
                autoComplete="current-password"
                required
              />
            </FormField>
            <div className="flex items-center justify-end text-xs text-emerald-900/70">
              <Link
                className="font-semibold text-emerald-700 hover:text-emerald-600"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
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
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="text-center text-xs text-emerald-900/70">
            New here?{" "}
            <a className="font-semibold text-emerald-700" href="/register">
              Create account
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
