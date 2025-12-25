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

export default async function BuyerDashboard() {
  const session = await requireRole("buyer");
  const token = session.token ?? "";
  const buyerId = session.userId ?? "";

  const [cartResult, ordersResult, profilesResult] = await Promise.allSettled([
    apiFetch(`/buyer/${buyerId}/cart`, { token }),
    apiFetch(`/buyer/${buyerId}/orders?page=1&limit=5`, { token }),
    apiFetch("/buyer", { token }),
  ]);

  const cart = cartResult.status === "fulfilled" ? cartResult.value : null;
  const orders = ordersResult.status === "fulfilled" ? ordersResult.value : null;
  const profiles =
    profilesResult.status === "fulfilled" ? profilesResult.value : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:py-20">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Buyer dashboard
          </p>
          <h1 className="text-3xl font-semibold text-emerald-950 sm:text-4xl">
            Welcome back, {session.displayName}
          </h1>
          <p className="max-w-2xl text-emerald-900/70">
            Live data is pulled from the buyer endpoints using your JWT.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Profile
            </p>
            <p className="mt-3 text-sm text-emerald-900/70">
              Buyer ID: {buyerId || "Not available"}
            </p>
            <p className="text-sm text-emerald-900/70">
              Email: {session.email || "Not available"}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Cart snapshot
            </p>
            <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap text-xs text-emerald-900/70">
              {formatData(cart)}
            </pre>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Recent orders
            </p>
            <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap text-xs text-emerald-900/70">
              {formatData(orders)}
            </pre>
          </div>
        </section>

        <section className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-sm backdrop-blur">
          <h2 className="text-xl font-semibold text-emerald-950">
            Buyer profiles (admin view)
          </h2>
          <p className="mt-2 text-sm text-emerald-900/70">
            Loaded from the buyer list endpoint for validation.
          </p>
          <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap text-xs text-emerald-900/70">
            {formatData(profiles)}
          </pre>
        </section>
      </main>
    </div>
  );
}
