import { apiFetch } from "@/lib/api";
import { requireRole } from "@/lib/auth";

function formatData(data: unknown) {
  if (!data) return "No data returned yet.";
  try {
    const json = JSON.stringify(data, null, 2);
    return json.length > 900 ? `${json.slice(0, 900)}\n...` : json;
  } catch {
    return "Unable to display data.";
  }
}

export default async function AdminDashboard() {
  const session = await requireRole("admin");
  const token = session.token ?? "";
  const adminId = session.userId ?? "";

  const [profileResult, auditResult, buyersResult] = await Promise.allSettled([
    apiFetch(`/admin/users/${adminId}`, { token }),
    apiFetch("/admin/audit-logs", { token }),
    apiFetch(`/admin/${adminId}/buyers`, { token }),
  ]);

  const profile =
    profileResult.status === "fulfilled" ? profileResult.value : null;
  const audits = auditResult.status === "fulfilled" ? auditResult.value : null;
  const buyers = buyersResult.status === "fulfilled" ? buyersResult.value : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:py-20">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Admin dashboard
          </p>
          <h1 className="text-3xl font-semibold text-emerald-950 sm:text-4xl">
            Control center
          </h1>
          <p className="max-w-2xl text-emerald-900/70">
            Live data is pulled from admin endpoints using your JWT.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Admin profile
            </p>
            <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap text-xs text-emerald-900/70">
              {formatData(profile)}
            </pre>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Assigned buyers
            </p>
            <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap text-xs text-emerald-900/70">
              {formatData(buyers)}
            </pre>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Audit logs
            </p>
            <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap text-xs text-emerald-900/70">
              {formatData(audits)}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}
