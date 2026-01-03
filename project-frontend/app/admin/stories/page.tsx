import AdminStoriesClient from "@/components/admin/AdminStoriesClient";
import { requireRole } from "@/lib/auth";

export default async function AdminStoriesPage() {
  const session = await requireRole("admin");
  const token = session.token ?? "";
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:py-20">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Admin stories
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Approve seller stories
          </h1>
          <p className="max-w-2xl text-slate-600">
            Review and approve seller stories before they go live for buyers.
          </p>
        </header>

        <AdminStoriesClient token={token} apiBaseUrl={apiBaseUrl} />
      </main>
    </div>
  );
}
