import Navbar from "@/components/Navbar";
import { requireGuest } from "@/lib/auth";
import type { ReactNode } from "react";

type PublicLayoutProps = {
  children: ReactNode;
};

export default async function PublicLayout({ children }: PublicLayoutProps) {
  await requireGuest();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <Navbar />
      {children}
    </div>
  );
}
