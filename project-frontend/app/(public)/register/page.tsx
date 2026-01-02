"use client";

import FormField from "@/components/forms/FormField";
import {
  registerAdmin,
  registerAdminFormSchema,
  registerBuyer,
  registerBuyerFormSchema,
  registerSeller,
  registerSellerFormSchema,
} from "@/lib/auth-client";
import { useState } from "react";
import Image from "next/image";

export const dynamic = "force-static";

type RoleKey = "BUYER" | "SELLER" | "ADMIN";

const roleOptions: Array<{ value: RoleKey; label: string; blurb: string }> = [
  {
    value: "BUYER",
    label: "Buyer",
    blurb: "Shop local produce, track orders, and save favorites.",
  },
  {
    value: "SELLER",
    label: "Seller",
    blurb: "List your store, manage orders, and reach nearby buyers.",
  },
  {
    value: "ADMIN",
    label: "Admin",
    blurb: "Manage marketplace operations and support requests.",
  },
];

export default function RegisterPage() {
  const [role, setRole] = useState<RoleKey>("BUYER");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inputClassName = (hasError?: string) =>
    `mt-2 w-full border-b bg-transparent pb-2 text-sm text-emerald-950 outline-none ${
      hasError
        ? "border-rose-400 focus:border-rose-500"
        : "border-emerald-200 focus:border-emerald-500"
    }`;

  const currentRole = roleOptions.find((option) => option.value === role);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setErrors({});

    const formData = new FormData(event.currentTarget);

    try {
      if (role === "BUYER") {
        const parsed = registerBuyerFormSchema.safeParse({
          fullName: String(formData.get("buyerFullName") ?? ""),
          phone: String(formData.get("buyerPhone") ?? ""),
          email: String(formData.get("buyerEmail") ?? ""),
          password: String(formData.get("buyerPassword") ?? ""),
        });
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
        await registerBuyer(parsed.data);
      }

      if (role === "SELLER") {
        const parsed = registerSellerFormSchema.safeParse({
          storeName: String(formData.get("sellerStoreName") ?? ""),
          email: String(formData.get("sellerEmail") ?? ""),
          password: String(formData.get("sellerPassword") ?? ""),
        });
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
        await registerSeller(parsed.data);
      }

      if (role === "ADMIN") {
        const parsed = registerAdminFormSchema.safeParse({
          displayName: String(formData.get("adminDisplayName") ?? ""),
          email: String(formData.get("adminEmail") ?? ""),
          password: String(formData.get("adminPassword") ?? ""),
        });
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
        await registerAdmin(parsed.data);
      }
      setStatus("success");
      setMessage("Registration submitted. Check your email for next steps.");
    } catch (error) {
      setStatus("idle");
      setMessage("");
      setErrors({
        form: error instanceof Error ? error.message : "Registration failed.",
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
              {currentRole?.blurb ?? "Create a role-based account in minutes."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormField id="register-role-type" label="Register as">
              <select
                id="register-role-type"
                name="roleType"
                className={inputClassName()}
                value={role}
                onChange={(event) => {
                  setRole(event.target.value as RoleKey);
                  setErrors({});
                  setMessage("");
                }}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            {role === "BUYER" ? (
              <div className="space-y-4">
                <FormField
                  id="buyer-full-name"
                  label="Full name"
                  error={errors.fullName}
                >
                  <input
                    id="buyer-full-name"
                    name="buyerFullName"
                    type="text"
                    placeholder="Buyer name"
                    className={inputClassName(errors.fullName)}
                    required
                  />
                </FormField>
                <FormField
                  id="buyer-phone"
                  label="Phone number"
                  error={errors.phone}
                >
                  <input
                    id="buyer-phone"
                    name="buyerPhone"
                    type="tel"
                    placeholder="01700000000"
                    className={inputClassName(errors.phone)}
                    required
                  />
                </FormField>
                <FormField
                  id="buyer-email"
                  label="Email address"
                  error={errors.email}
                >
                  <input
                    id="buyer-email"
                    name="buyerEmail"
                    type="email"
                    placeholder="you@example.com"
                    className={inputClassName(errors.email)}
                    autoComplete="email"
                    required
                  />
                </FormField>
                <FormField
                  id="buyer-password"
                  label="Password"
                  error={errors.password}
                >
                  <input
                    id="buyer-password"
                    name="buyerPassword"
                    type="password"
                    placeholder="Minimum 6 characters"
                    className={inputClassName(errors.password)}
                    autoComplete="new-password"
                    required
                  />
                </FormField>
              </div>
            ) : null}

            {role === "SELLER" ? (
              <div className="space-y-4">
                <FormField
                  id="seller-store-name"
                  label="Store name"
                  error={errors.storeName}
                >
                  <input
                    id="seller-store-name"
                    name="sellerStoreName"
                    type="text"
                    placeholder="Store Name"
                    className={inputClassName(errors.storeName)}
                    required
                  />
                </FormField>
                <FormField
                  id="seller-email"
                  label="Email address"
                  error={errors.email}
                >
                  <input
                    id="seller-email"
                    name="sellerEmail"
                    type="email"
                    placeholder="seller@demo.com"
                    className={inputClassName(errors.email)}
                    autoComplete="email"
                    required
                  />
                </FormField>
                <FormField
                  id="seller-password"
                  label="Password"
                  error={errors.password}
                >
                  <input
                    id="seller-password"
                    name="sellerPassword"
                    type="password"
                    placeholder="Minimum 6 characters"
                    className={inputClassName(errors.password)}
                    autoComplete="new-password"
                    required
                  />
                </FormField>
              </div>
            ) : null}

            {role === "ADMIN" ? (
              <div className="space-y-4">
                <FormField
                  id="admin-display-name"
                  label="Display name"
                  error={errors.displayName}
                >
                  <input
                    id="admin-display-name"
                    name="adminDisplayName"
                    type="text"
                    placeholder="Admin Name"
                    className={inputClassName(errors.displayName)}
                    required
                  />
                </FormField>
                <FormField
                  id="admin-email"
                  label="Email address"
                  error={errors.email}
                >
                  <input
                    id="admin-email"
                    name="adminEmail"
                    type="email"
                    placeholder="admin@demo.com"
                    className={inputClassName(errors.email)}
                    autoComplete="email"
                    required
                  />
                </FormField>
                <FormField
                  id="admin-password"
                  label="Password"
                  error={errors.password}
                >
                  <input
                    id="admin-password"
                    name="adminPassword"
                    type="password"
                    placeholder="Minimum 6 characters"
                    className={inputClassName(errors.password)}
                    autoComplete="new-password"
                    required
                  />
                </FormField>
                <p className="text-[11px] text-emerald-900/60">
                  Admin registration requires backend support to be enabled.
                </p>
              </div>
            ) : null}

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
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating..." : "Create account"}
            </button>
            <p className="text-[11px] text-emerald-900/60">
              By creating an account you agree to future Toor-Taja terms and
              privacy policies.
            </p>
          </form>

          <div className="text-center text-xs text-emerald-900/70">
            Already have an account?{" "}
            <a className="font-semibold text-emerald-700" href="/login">
              Sign in
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
