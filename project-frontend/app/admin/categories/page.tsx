import AdminCategoriesClient from "@/components/admin/AdminCategoriesClient";
import { requireRole } from "@/lib/auth";

export default async function AdminCategoriesPage() {
  await requireRole("admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:py-20">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Category management
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Organize your storefront
          </h1>
          <p className="max-w-2xl text-slate-600">
            Create the category list sellers will pick from when uploading
            products.
          </p>
          <a
            className="inline-flex items-center justify-center rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-300"
            href="/admin"
          >
            Back to dashboard
          </a>
        </header>

        <AdminCategoriesClient />
      </main>
    </div>
  );
}
