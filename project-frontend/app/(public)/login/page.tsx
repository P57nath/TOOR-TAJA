"use client";

import { loginSchema } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export const dynamic = "force-static";

export default function LoginPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timeout);
  }, [toast]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const API_BASE =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010";

    try {
      const payload = loginSchema.safeParse({ email, password });
      if (!payload.success) {
        setStatus("idle");
        setMessage(payload.error.issues[0]?.message ?? "Invalid login details.");
        return;
      }
      await axios.post(
        `${API_BASE}/auth/login`,
        { email: payload.data.email, password: payload.data.password },
        { withCredentials: true },
      );

      setStatus("success");
      setMessage("");
      setToast("Login successful. Redirecting...");
      setTimeout(() => router.push("/products"), 600);
    } catch (error) {
      setStatus("idle");
      const serverMsg =
        (error as any)?.response?.data?.message ||
        (error as any)?.response?.data ||
        (error as any)?.message;
      setMessage(
        typeof serverMsg === "string"
          ? serverMsg
          : "Unable to sign in right now.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      {toast ? (
        <div className="fixed right-6 top-6 z-50 rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 shadow-lg">
          {toast}
        </div>
      ) : null}
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
