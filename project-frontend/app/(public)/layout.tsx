import { requireGuest } from "@/lib/auth";
import type { ReactNode } from "react";

type PublicLayoutProps = {
  children: ReactNode;
};

export default async function PublicLayout({ children }: PublicLayoutProps) {
  await requireGuest();

  return <>{children}</>;
}
