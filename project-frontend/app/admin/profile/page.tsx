import AdminProfileClient from "@/components/admin/AdminProfileClient";
import { requireRole } from "@/lib/auth";

export default async function AdminProfilePage() {
  await requireRole("admin");

  return <AdminProfileClient />;
}
