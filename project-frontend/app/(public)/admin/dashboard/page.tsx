"use client";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 text-zinc-900">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <h1 className="text-3xl font-semibold text-rose-950">
          Admin Dashboard
        </h1>
        <p className="text-sm text-rose-900/70">
          This is a dummy admin dashboard page.
        </p>
      </main>
    </div>
  );
}
