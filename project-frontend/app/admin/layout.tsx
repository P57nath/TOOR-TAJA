import { requireRole } from "@/lib/auth";
import type { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireRole("admin");

  return <>{children}</>;
}
