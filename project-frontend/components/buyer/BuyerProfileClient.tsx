"use client";

import { useEffect, useState } from "react";

type BuyerProfile = {
  fullName?: string;
  phone?: string | null;
  age?: number | null;
  address?: string | null;
  user?: { email?: string };
};

export default function BuyerProfileClient() {
  const [profile, setProfile] = useState<BuyerProfile | null>(null);
  const [formState, setFormState] = useState({
    fullName: "",
    phone: "",
    age: "",
    address: "",
    currentPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/buyer/profile", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        const profileData = data?.data ?? null;
        if (!profileData) return;
        setProfile(profileData);
        setFormState({
          fullName: profileData.fullName ?? "",
          phone: profileData.phone ?? "",
          age:
            profileData.age === null || profileData.age === undefined
              ? ""
              : String(profileData.age),
          address: profileData.address ?? "",
          currentPassword: "",
        });
      } catch {
        return;
      }
    }

    void loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!formState.currentPassword) {
      setMessage("Current password is required.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        fullName: formState.fullName.trim(),
        phone: formState.phone.trim() || undefined,
        age: formState.age ? Number(formState.age) : undefined,
        address: formState.address.trim() || undefined,
        currentPassword: formState.currentPassword,
      };
      const response = await fetch("/api/buyer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.text();
      if (!response.ok) {
        throw new Error(data || "Unable to update profile.");
      }
      setMessage("Profile updated.");
      setFormState((prev) => ({ ...prev, currentPassword: "" }));
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
          Your profile
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-amber-950">
          Account overview
        </h1>
        <p className="mt-2 text-sm text-amber-900/70">
          Update your contact details and delivery preferences.
        </p>
        <p className="mt-2 text-xs text-amber-900/60">
          Signed in as {profile?.user?.email ?? "your account"}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <label className="flex flex-col gap-2 text-sm font-semibold text-amber-900">
          Full name
          <input
            className="rounded-2xl border border-amber-200 bg-amber-50/40 px-4 py-2 text-sm font-normal text-amber-900 outline-none focus:border-amber-300"
            value={formState.fullName}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, fullName: event.target.value }))
            }
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-amber-900">
          Phone
          <input
            className="rounded-2xl border border-amber-200 bg-amber-50/40 px-4 py-2 text-sm font-normal text-amber-900 outline-none focus:border-amber-300"
            value={formState.phone}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, phone: event.target.value }))
            }
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-amber-900">
          Age
          <input
            className="rounded-2xl border border-amber-200 bg-amber-50/40 px-4 py-2 text-sm font-normal text-amber-900 outline-none focus:border-amber-300"
            value={formState.age}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, age: event.target.value }))
            }
            inputMode="numeric"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-amber-900">
          Address
          <input
            className="rounded-2xl border border-amber-200 bg-amber-50/40 px-4 py-2 text-sm font-normal text-amber-900 outline-none focus:border-amber-300"
            value={formState.address}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, address: event.target.value }))
            }
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-amber-900 md:col-span-2">
          Current password (required)
          <input
            className="rounded-2xl border border-amber-200 bg-amber-50/40 px-4 py-2 text-sm font-normal text-amber-900 outline-none focus:border-amber-300"
            type="password"
            value={formState.currentPassword}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                currentPassword: event.target.value,
              }))
            }
          />
        </label>
        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <button
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
          {message ? (
            <span className="text-sm font-semibold text-amber-700">
              {message}
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
