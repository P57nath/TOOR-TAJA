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
    <div className="flex flex-col gap-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Seller dashboard
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
          Manage your storefront
        </h1>
        <p className="max-w-2xl text-zinc-700">
          This dashboard will be customized later.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900">
            Seller profile + products
          </h2>
          <p className="mt-2 text-sm text-zinc-700">
            Loaded from /seller/{sellerId}/with-products.
          </p>
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap text-xs text-zinc-700">
            {formatData(profile)}
          </pre>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900">
            Catalog overview
          </h2>
          <p className="mt-2 text-sm text-zinc-700">
            Loaded from /seller/products.
          </p>
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap text-xs text-zinc-700">
            {formatData(products)}
          </pre>
        </div>
      </section>
    </div>
  );
}
