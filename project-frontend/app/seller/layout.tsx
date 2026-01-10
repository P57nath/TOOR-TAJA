import { requireRole } from "@/lib/auth";
import type { ReactNode } from "react";
import SellerShell from "@/components/seller/SellerShell";

type SellerLayoutProps = {
  children: ReactNode;
};

export default async function SellerLayout({ children }: SellerLayoutProps) {
  await requireRole("seller");

  return <SellerShell>{children}</SellerShell>;
}
