import SellerProductForm from "@/components/seller/SellerProductForm";
import { apiFetch } from "@/lib/api";
import { requireRole } from "@/lib/auth";

type Category = {
  id: string;
  name: string;
};

type CategoriesResponse = {
  success: boolean;
  data: Category[];
};

export default async function SellerAddProductPage() {
  await requireRole("seller");

  let categories: Category[] = [];
  try {
    const response = await apiFetch<CategoriesResponse>("/products/categories");
    categories = response.data ?? [];
  } catch {
    categories = [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 sm:py-20">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            Seller catalog
          </p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Add a new product
          </h1>
          <p className="max-w-2xl text-white/70">
            Categories are managed by the admin team. Choose the best fit before
            publishing.
          </p>
          <a
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
            href="/seller"
          >
            Back to dashboard
          </a>
        </header>

        {categories.length ? (
          <SellerProductForm categories={categories} />
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-white/70">
            No categories yet. Ask an admin to create categories before adding
            products.
          </div>
        )}
      </main>
    </div>
  );
}
