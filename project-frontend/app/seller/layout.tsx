import { requireRole } from "@/lib/auth";
import type { ReactNode } from "react";
import SellerShell from "@/components/seller/SellerShell";

type SellerLayoutProps = {
  children: ReactNode;
};

export default async function SellerLayout({ children }: SellerLayoutProps) {
  const session = await requireRole("seller");

  return (
    <SellerShell
      notificationRole="seller"
      notificationUserId={session.userId}
    >
      {children}
    </SellerShell>
  );
}
