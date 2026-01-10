import AdminCategoriesClient from "@/components/admin/AdminCategoriesClient";
import { requireRole } from "@/lib/auth";

export default async function AdminCategoriesPage() {
  await requireRole("admin");

  return (
    <div className="flex flex-col gap-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Category management
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
          Organize your storefront
        </h1>
        <p className="max-w-2xl text-zinc-700">
          Create the category list sellers will pick from when uploading
          products.
        </p>
      </header>

      <AdminCategoriesClient />
    </div>
  );
}
