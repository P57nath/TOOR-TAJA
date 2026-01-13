import SellerProductsManager from "@/components/seller/SellerProductsManager";
import { apiFetch } from "@/lib/api";
import { requireRole } from "@/lib/auth";

type Category = {
  id: string;
  name: string;
  subcategories?: Array<{ id: string; name: string }>;
};

type CategoriesResponse = {
  success: boolean;
  data: Category[];
};

export default async function SellerDashboard() {
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
          Seller dashboard
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
          Manage your storefront
        </h1>
        <p className="max-w-2xl text-zinc-700">
          Review your catalog and update product details without leaving this
          page.
        </p>
      </header>

      <SellerProductsManager
        categories={categories}
        imageBaseUrl={
          process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010"
        }
      />
    </div>
  );
}
