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

export default async function SellerDashboard() {
  const session = await requireRole("seller");
  const token = session.token ?? "";
  const sellerId = session.userId ?? "";

  const [profileResult, productsResult] = await Promise.allSettled([
    apiFetch(`/seller/${sellerId}/with-products`, { token }),
    apiFetch("/seller/products", { token }),
  ]);

  const profile =
    profileResult.status === "fulfilled" ? profileResult.value : null;
  const products =
    productsResult.status === "fulfilled" ? productsResult.value : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:py-20">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Seller dashboard
          </p>
          <h1 className="text-3xl font-semibold text-emerald-950 sm:text-4xl">
            Manage your storefront
          </h1>
          <p className="max-w-2xl text-emerald-900/70">
            Live data is pulled from seller endpoints using your JWT.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-emerald-950">
              Seller profile + products
            </h2>
            <p className="mt-2 text-sm text-emerald-900/70">
              Loaded from /seller/{sellerId}/with-products.
            </p>
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap text-xs text-emerald-900/70">
              {formatData(profile)}
            </pre>
          </div>
          <div className="rounded-3xl border border-sky-100 bg-white/80 p-8 shadow-sm backdrop-blur">
            <h2 className="text-xl font-semibold text-emerald-950">
              Catalog overview
            </h2>
            <p className="mt-2 text-sm text-emerald-900/70">
              Loaded from /seller/products.
            </p>
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap text-xs text-emerald-900/70">
              {formatData(products)}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
}
