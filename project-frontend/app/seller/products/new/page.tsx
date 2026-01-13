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
    <div className="flex flex-col gap-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Seller catalog
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
          Add a new product
        </h1>
        <p className="max-w-2xl text-zinc-700">
          Pick the right category, set a unit size, and publish with confidence.
        </p>
      </header>

      {categories.length ? (
        <SellerProductForm categories={categories} />
      ) : (
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 text-sm text-zinc-700">
          No categories yet. Ask an admin to create categories before adding
          products.
        </div>
      )}
    </div>
  );
}
