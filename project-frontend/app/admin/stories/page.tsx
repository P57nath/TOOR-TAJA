import AdminStoriesClient from "@/components/admin/AdminStoriesClient";
import { requireRole } from "@/lib/auth";

export default async function AdminStoriesPage() {
  const session = await requireRole("admin");
  const token = session.token ?? "";
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010";

  return (
    <div className="flex flex-col gap-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Admin stories
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
          Approve seller stories
        </h1>
        <p className="max-w-2xl text-zinc-700">
          Review and approve seller stories before they go live for buyers.
        </p>
      </header>

      <AdminStoriesClient token={token} apiBaseUrl={apiBaseUrl} />
    </div>
  );
}
