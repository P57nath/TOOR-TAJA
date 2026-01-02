import { requireGuest } from "@/lib/auth";
import type { ReactNode } from "react";

type PublicLayoutProps = {
  children: ReactNode;
};

export default async function PublicLayout({ children }: PublicLayoutProps) {
  await requireGuest();

  return (
    <div className="h-screen bg-[#C5D89D] text-zinc-900">
      {children}
    </div>
  );
}
