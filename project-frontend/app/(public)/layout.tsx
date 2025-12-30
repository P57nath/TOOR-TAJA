import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <Navbar />
      {children}
    </div>
  );
}
