import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import { requireRole } from "@/lib/auth";

export default async function AdminOrdersPage() {
  await requireRole("admin");

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Admin orders
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
          Order control center
        </h1>
        <p className="text-sm text-zinc-700">
          Review every order and reconcile payment status across the
          marketplace.
        </p>
      </header>

      <AdminOrdersClient />
    </div>
  );
}
