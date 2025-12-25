"use client";

import { login } from "@/lib/auth-client";
import { useState } from "react";

export const dynamic = "force-static";

export default function LoginPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await login({ email, password });
      setStatus("success");
      setMessage("Signed in successfully. Token issued by the server.");
    } catch (error) {
      setStatus("idle");
      setMessage(
        error instanceof Error ? error.message : "Unable to sign in right now.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 sm:py-20">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold text-emerald-950 sm:text-4xl">
            Sign in to Toor-Taja
          </h1>
          <p className="max-w-2xl text-emerald-900/70">
            Access saved carts, track orders, and follow your favorite sellers.
            Authentication will be wired in Phase 3.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <form
            className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur"
            onSubmit={handleSubmit}
          >
            <div className="space-y-6">
              <div>
                <label
                  className="text-sm font-semibold text-emerald-900"
                  htmlFor="login-email"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label
                  className="text-sm font-semibold text-emerald-900"
                  htmlFor="login-password"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="********"
                  className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-sm text-emerald-900/70">
                <span>Guest mode active</span>
                <button
                  className="font-semibold text-emerald-700 hover:text-emerald-600"
                  type="button"
                >
                  Forgot password?
                </button>
              </div>
              {message ? (
                <p
                  className={`text-sm ${
                    status === "success"
                      ? "text-emerald-700"
                      : "text-rose-600"
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
            </div>
          </form>

          <aside className="space-y-6 rounded-3xl border border-sky-100 bg-white/70 p-8 shadow-sm backdrop-blur">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-950">
                New to Toor-Taja?
              </h2>
              <p className="text-sm text-emerald-900/70">
                Create an account to follow local sellers, save your favorites,
                and speed through checkout.
              </p>
              <a
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white/70 px-6 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-400"
                href="/register"
              >
                Create account
              </a>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 text-sm text-emerald-900/70">
              <p className="font-semibold text-emerald-950">
                Why sign in later?
              </p>
              <p className="mt-2">
                Upcoming features include delivery preferences, order history,
                and seller messaging.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
