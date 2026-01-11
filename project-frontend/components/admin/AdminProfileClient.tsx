"use client";

import { useEffect, useState } from "react";

type AdminProfile = {
  displayName?: string;
  profileName?: string | null;
  user?: { email?: string };
};

export default function AdminProfileClient() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [formState, setFormState] = useState({
    displayName: "",
    profileName: "",
    currentPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/admin/profile", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        const profileData = data?.data ?? null;
        if (!profileData) return;
        setProfile(profileData);
        setFormState({
          displayName: profileData.displayName ?? "",
          profileName: profileData.profileName ?? "",
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
        displayName: formState.displayName.trim(),
        profileName: formState.profileName.trim() || undefined,
        currentPassword: formState.currentPassword,
      };
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
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
      <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Admin profile
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900">
          Account settings
        </h1>
        <p className="mt-2 text-sm text-zinc-700">
          Update your display information for internal dashboards.
        </p>
        <p className="mt-2 text-xs text-zinc-600">
          Signed in as {profile?.user?.email ?? "your account"}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-800">
          Display name
          <input
            className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-2 text-sm font-normal text-zinc-900 outline-none focus:border-emerald-300"
            value={formState.displayName}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                displayName: event.target.value,
              }))
            }
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-800">
          Profile name
          <input
            className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-2 text-sm font-normal text-zinc-900 outline-none focus:border-emerald-300"
            value={formState.profileName}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                profileName: event.target.value,
              }))
            }
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-800 md:col-span-2">
          Current password (required)
          <input
            className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-2 text-sm font-normal text-zinc-900 outline-none focus:border-emerald-300"
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
            <span className="text-sm font-semibold text-emerald-700">
              {message}
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
