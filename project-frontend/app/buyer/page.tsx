import BuyerShell from "@/components/buyer/BuyerShell";
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
    <BuyerShell>
      <div className="flex w-full flex-col gap-10">
        <section className="grid gap-10 rounded-3xl bg-amber-200/80 p-8 shadow-sm md:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              Buyer dashboard
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-amber-950">
              Grocery delivered at your doorstep
            </h1>
            <p className="text-base text-amber-900/80">
              Welcome back, {session.displayName}. Track fresh picks, manage
              your cart, and reorder favorites in one place.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "+15000 products to shop from",
                "Pay after receiving products",
                "Get delivery within 1 hour",
                "Get offers that save money",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-amber-100 bg-white/80 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <div className="aspect-[4/3] rounded-3xl bg-white shadow-sm" />
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-2xl bg-white shadow-sm" />
              <div className="aspect-square rounded-2xl bg-white shadow-sm" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-amber-950">
              Popular categories
            </h2>
            <a className="text-sm font-semibold text-amber-700" href="#">
              View all
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Fresh produce", "Staples", "Snacks", "Household"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-amber-900">{item}</p>
                <p className="mt-2 text-xs text-amber-900/70">
                  Curated daily picks.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Profile
            </p>
            <p className="mt-3 text-sm text-amber-900/70">
              Buyer ID: {buyerId || "Not available"}
            </p>
            <p className="text-sm text-amber-900/70">
              Email: {session.email || "Not available"}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Cart snapshot
            </p>
            <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap text-xs text-amber-900/70">
              {formatData(cart)}
            </pre>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Recent orders
            </p>
            <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap text-xs text-amber-900/70">
              {formatData(orders)}
            </pre>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-amber-950">
            Buyer profiles (admin view)
          </h2>
          <p className="mt-2 text-sm text-amber-900/70">
            Loaded from the buyer list endpoint for validation.
          </p>
          <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap text-xs text-amber-900/70">
            {formatData(profiles)}
          </pre>
        </section>
      </div>
    </BuyerShell>
  );
}
