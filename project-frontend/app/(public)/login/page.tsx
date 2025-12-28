"use client";

import { login } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const dynamic = "force-static";

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [message, setMessage] = useState("");

  function parseJwtPayload(token: string) {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "=",
      );
      const json = atob(padded);
      return JSON.parse(json) as { role?: string; sub?: string; email?: string };
    } catch {
      return null;
    }
  }

  function setSessionCookies(token: string) {
    const payload = parseJwtPayload(token);
    const role = payload?.role ?? "guest";
    const userId = payload?.sub ?? "";
    const email = payload?.email ?? "";

    document.cookie = `access_token=${encodeURIComponent(
      token,
    )}; path=/; max-age=86400`;
    document.cookie = `role=${encodeURIComponent(
      role,
    )}; path=/; max-age=86400`;
    document.cookie = `user_id=${encodeURIComponent(
      userId,
    )}; path=/; max-age=86400`;
    document.cookie = `user_email=${encodeURIComponent(
      email,
    )}; path=/; max-age=86400`;

    return { role };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const response = await login({ email, password });
      const session = setSessionCookies(response.access_token);
      setStatus("success");
      setMessage("Signed in successfully. Token issued by the server.");
      if (session.role === "buyer") {
        router.push("/buyer");
      } else if (session.role === "seller") {
        router.push("/seller");
      } else if (session.role === "admin") {
        router.push("/admin");
      }
    } catch (error) {
      setStatus("idle");
      setMessage(
        error instanceof Error ? error.message : "Unable to sign in right now.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:py-16">
        <section className="grid overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-sm backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
          <aside className="relative min-h-[420px] overflow-hidden bg-emerald-100/80">
            <Image
              src="/register-illustration.jpg"
              alt="Toor-Taja illustration"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </aside>

          <div className="flex flex-col justify-center gap-6 p-10">
            <div className="flex flex-col items-center gap-3 text-center">
              <Image
                src="/file.svg"
                width={36}
                height={36}
                alt="Toor-Taja logo"
                className="h-9 w-9"
              />
              <h2 className="text-2xl font-semibold text-emerald-950">
                ToorTaja
              </h2>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700"
                  htmlFor="login-email"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full border-b border-emerald-200 bg-transparent pb-2 text-sm text-emerald-950 outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700"
                  htmlFor="login-password"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="********"
                  className="mt-2 w-full border-b border-emerald-200 bg-transparent pb-2 text-sm text-emerald-950 outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-900/70">
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
    </div>
  );
}
