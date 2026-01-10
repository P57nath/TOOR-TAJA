import { requireRole } from "@/lib/auth";
import AdminSellerApproval from "@/components/admin/AdminSellerApproval";

export default async function AdminDashboard() {
  await requireRole("admin");

  return (
    <div className="flex flex-col gap-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Admin dashboard
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
          Control center
        </h1>
        <p className="max-w-2xl text-zinc-700">
          This dashboard will be customized later.
        </p>
      </header>

      <AdminSellerApproval />
    </div>
  );
}
