"use client";

import { registerAdmin, registerBuyer, registerSeller } from "@/lib/auth-client";
import { useState } from "react";

export const dynamic = "force-static";

export default function RegisterPage() {
  const [role, setRole] = useState<"admin" | "buyer" | "seller">("admin");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const profileFile = formData.get("profileFile");

    try {
      if (role === "buyer") {
        await registerBuyer({
          name: String(formData.get("buyerName") ?? ""),
          email: String(formData.get("buyerEmail") ?? ""),
          password: String(formData.get("buyerPassword") ?? ""),
          phone: String(formData.get("buyerPhone") ?? "") || undefined,
          age: formData.get("buyerAge")
            ? Number(formData.get("buyerAge"))
            : undefined,
          status: (formData.get("buyerStatus") as
            | "active"
            | "inactive"
            | null) ?? undefined,
          defaultAddressId: String(formData.get("buyerAddress") ?? "") || undefined,
        });
      }

      if (role === "seller") {
        await registerSeller({
          username: String(formData.get("sellerUsername") ?? ""),
          fullName: String(formData.get("sellerFullName") ?? ""),
          email: String(formData.get("sellerEmail") ?? ""),
          password: String(formData.get("sellerPassword") ?? ""),
          gender: String(formData.get("sellerGender") ?? "male") as
            | "male"
            | "female",
          phoneNumber: String(formData.get("sellerPhone") ?? ""),
          isActive: (formData.get("sellerStatus") as
            | "active"
            | "inactive"
            | null) ?? undefined,
        });
      }

      if (role === "admin") {
        await registerAdmin(
          {
            name: String(formData.get("adminName") ?? ""),
            email: String(formData.get("adminEmail") ?? ""),
            password: String(formData.get("adminPassword") ?? ""),
            nid: String(formData.get("adminNid") ?? ""),
            role: String(formData.get("adminRole") ?? "manager") as
              | "superadmin"
              | "manager"
              | "support",
            phone: String(formData.get("adminPhone") ?? ""),
            isActive: (formData.get("adminStatus") as
              | "active"
              | "inactive"
              | null) ?? undefined,
          },
          profileFile instanceof File ? profileFile : undefined,
        );
      }
      setStatus("success");
      setMessage("Registration submitted. Check your email for next steps.");
    } catch (error) {
      setStatus("idle");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to create the account right now.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 sm:py-20">
        <header className="space-y-4 rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Join the marketplace
              </p>
              <h1 className="text-3xl font-semibold text-emerald-950 sm:text-4xl">
                Create your Toor-Taja account
              </h1>
            </div>
            <a
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white/70 px-5 py-2 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-400"
              href="/"
            >
              Back to home
            </a>
          </div>
          <p className="max-w-2xl text-emerald-900/70">
            Choose a role to register. Buyer and seller details follow the
            backend rules you shared.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <form
            className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur"
            onSubmit={handleSubmit}
          >
            <div className="space-y-6">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-900/70">
                Select a role to see the required fields for that account type.
              </div>
              <div>
                <label
                  className="text-sm font-semibold text-emerald-900"
                  htmlFor="register-role-type"
                >
                  Register as
                </label>
                <select
                  id="register-role-type"
                  name="roleType"
                  className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as "admin" | "buyer" | "seller")
                  }
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {role === "buyer" ? (
                <div className="space-y-6">
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="buyer-name"
                    >
                      Full name
                    </label>
                    <input
                      id="buyer-name"
                      name="buyerName"
                      type="text"
                      placeholder="Buyer name"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="buyer-email"
                    >
                      Email address
                    </label>
                    <input
                      id="buyer-email"
                      name="buyerEmail"
                      type="email"
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="buyer-password"
                    >
                      Password
                    </label>
                    <input
                      id="buyer-password"
                      name="buyerPassword"
                      type="password"
                      placeholder="Minimum 6 chars, 1 lowercase"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        className="text-sm font-semibold text-emerald-900"
                        htmlFor="buyer-phone"
                      >
                        Phone (optional)
                      </label>
                      <input
                        id="buyer-phone"
                        name="buyerPhone"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm font-semibold text-emerald-900"
                        htmlFor="buyer-age"
                      >
                        Age (optional)
                      </label>
                      <input
                        id="buyer-age"
                        name="buyerAge"
                        type="number"
                        min={8}
                        max={120}
                        placeholder="18"
                        className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        className="text-sm font-semibold text-emerald-900"
                        htmlFor="buyer-status"
                      >
                        Status (optional)
                      </label>
                      <select
                        id="buyer-status"
                        name="buyerStatus"
                        className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                        defaultValue=""
                      >
                        <option value="">Select</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="text-sm font-semibold text-emerald-900"
                        htmlFor="buyer-address"
                      >
                        Default address ID (optional)
                      </label>
                      <input
                        id="buyer-address"
                        name="buyerAddress"
                        type="text"
                        placeholder="Address ID"
                        className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {role === "seller" ? (
                <div className="space-y-6">
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="seller-username"
                    >
                      Username
                    </label>
                    <input
                      id="seller-username"
                      name="sellerUsername"
                      type="text"
                      placeholder="seller123"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="seller-full-name"
                    >
                      Full name
                    </label>
                    <input
                      id="seller-full-name"
                      name="sellerFullName"
                      type="text"
                      placeholder="Seller full name"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="seller-email"
                    >
                      Email address (@aiub.edu)
                    </label>
                    <input
                      id="seller-email"
                      name="sellerEmail"
                      type="email"
                      placeholder="name@aiub.edu"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="seller-password"
                    >
                      Password
                    </label>
                    <input
                      id="seller-password"
                      name="sellerPassword"
                      type="password"
                      placeholder="Min 6 chars, 1 uppercase"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        className="text-sm font-semibold text-emerald-900"
                        htmlFor="seller-gender"
                      >
                        Gender
                      </label>
                      <select
                        id="seller-gender"
                        name="sellerGender"
                        className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                        defaultValue="male"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="text-sm font-semibold text-emerald-900"
                        htmlFor="seller-phone"
                      >
                        Phone number
                      </label>
                      <input
                        id="seller-phone"
                        name="sellerPhone"
                        type="tel"
                        placeholder="Phone number"
                        className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="seller-status"
                    >
                      Status (optional)
                    </label>
                    <select
                      id="seller-status"
                      name="sellerStatus"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      defaultValue=""
                    >
                      <option value="">Select</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              ) : null}

              {role === "admin" ? (
                <div className="space-y-6">
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="admin-name"
                    >
                      Full name
                    </label>
                    <input
                      id="admin-name"
                      name="adminName"
                      type="text"
                      placeholder="Full name"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="admin-email"
                    >
                      Email address
                    </label>
                    <input
                      id="admin-email"
                      name="adminEmail"
                      type="email"
                      placeholder="admin@company.com"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="admin-password"
                    >
                      Password
                    </label>
                    <input
                      id="admin-password"
                      name="adminPassword"
                      type="password"
                      placeholder="Create a secure password"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="admin-nid"
                    >
                      NID
                    </label>
                    <input
                      id="admin-nid"
                      name="adminNid"
                      type="text"
                      placeholder="10, 13, or 17 digits"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="admin-phone"
                    >
                      Phone number
                    </label>
                    <input
                      id="admin-phone"
                      name="adminPhone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        className="text-sm font-semibold text-emerald-900"
                        htmlFor="admin-role"
                      >
                        Admin role
                      </label>
                      <select
                        id="admin-role"
                        name="adminRole"
                        className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                        defaultValue="manager"
                      >
                        <option value="superadmin">Superadmin</option>
                        <option value="manager">Manager</option>
                        <option value="support">Support</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="text-sm font-semibold text-emerald-900"
                        htmlFor="admin-status"
                      >
                        Status (optional)
                      </label>
                      <select
                        id="admin-status"
                        name="adminStatus"
                        className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                        defaultValue=""
                      >
                        <option value="">Select</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold text-emerald-900"
                      htmlFor="admin-profile"
                    >
                      Profile image (optional)
                    </label>
                    <input
                      id="admin-profile"
                      name="profileFile"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              ) : null}
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
                {status === "loading" ? "Creating..." : "Create account"}
              </button>
              <p className="text-xs text-emerald-900/60">
                By creating an account you agree to future Toor-Taja terms and
                privacy policies.
              </p>
            </div>
          </form>

          <aside className="space-y-6 rounded-3xl border border-amber-100 bg-white/70 p-8 shadow-sm backdrop-blur">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-950">
                Already have an account?
              </h2>
              <p className="text-sm text-emerald-900/70">
                Return to sign in and continue shopping from your saved lists.
              </p>
              <a
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white/70 px-6 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-400"
                href="/login"
              >
                Sign in
              </a>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 text-sm text-emerald-900/70">
              <p className="font-semibold text-emerald-950">
                Marketplace benefits
              </p>
              <p className="mt-2">
                Early access to new sellers, flexible delivery windows, and
                curated weekly picks.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
