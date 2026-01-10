import { requireRole } from "@/lib/auth";
import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await requireRole("admin");

  return (
    <AdminShell
      notificationRole="admin"
      notificationUserId={session.userId}
    >
      {children}
    </AdminShell>
  );
}
