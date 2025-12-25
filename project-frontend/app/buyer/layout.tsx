import { requireRole } from "@/lib/auth";
import type { ReactNode } from "react";

type BuyerLayoutProps = {
  children: ReactNode;
};

export default async function BuyerLayout({ children }: BuyerLayoutProps) {
  await requireRole("buyer");

  return <>{children}</>;
}
