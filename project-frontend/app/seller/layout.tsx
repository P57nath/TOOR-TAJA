import { requireRole } from "@/lib/auth";
import type { ReactNode } from "react";

type SellerLayoutProps = {
  children: ReactNode;
};

export default async function SellerLayout({ children }: SellerLayoutProps) {
  await requireRole("seller");

  return <>{children}</>;
}
