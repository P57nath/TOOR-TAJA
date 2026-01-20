"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import Navbar from "@/components/Navbar";

type AdminShellProps = {
  children: ReactNode;
  notificationRole?: "buyer" | "seller" | "admin";
  notificationUserId?: string;
};

const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg
        className="h-4 w-4 text-emerald-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12l9-9 9 9" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    label: "Seller approvals",
    href: "/admin",
    icon: (
      <svg
        className="h-4 w-4 text-amber-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12l2 2 4-4" />
        <rect x="4" y="4" width="16" height="16" rx="2" />
      </svg>
    ),
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: (
      <svg
        className="h-4 w-4 text-sky-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </svg>
    ),
  },
  {
    label: "Stories",
    href: "/admin/stories",
    icon: (
      <svg
        className="h-4 w-4 text-rose-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h10" />
        <path d="M7 12h8" />
        <path d="M7 16h6" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: (
      <svg
        className="h-4 w-4 text-emerald-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2h12v4H6z" />
        <path d="M6 10h12v12H6z" />
      </svg>
    ),
  },
];

export default function AdminShell({
  children,
  notificationRole,
  notificationUserId,
}: AdminShellProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-amber-50 text-zinc-900">
      <Navbar
        onMenuToggle={() => setIsNavOpen((open) => !open)}
        isMenuOpen={isNavOpen}
        showMenuButton
        showAuthButton={false}
        showUserActions
        logoHref="/admin"
        notificationRole={notificationRole}
        notificationUserId={notificationUserId}
        profileLinks={[
          { label: "Your profile", href: "/admin/profile" },
          { label: "Change password", href: "/forgot-password" },
        ]}
      />

      <main
        className={`relative mx-auto flex w-full max-w-6xl gap-6 px-6 pb-12 pt-8 transition-all duration-300 sm:pb-16 sm:pt-10 ${
          isNavOpen ? "lg:pl-[240px]" : ""
        }`}
      >
        <aside
          className={`fixed left-0 top-[68px] z-40 h-[calc(100vh-68px)] w-56 bg-transparent px-2 py-4 shadow-xl backdrop-blur-md transition-transform duration-300 ${
            isNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="sidebar-scroll flex max-h-full flex-col gap-1 overflow-y-auto pt-2">
            {adminNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex w-full items-center justify-between rounded-2xl border border-zinc-900/10 bg-white/70 px-3 py-2 text-[11px] font-semibold leading-tight text-zinc-900 shadow-sm transition hover:-translate-y-0.5 backdrop-blur-md"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-4 w-4 items-center justify-center">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </span>
              </a>
            ))}
          </div>
        </aside>

        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
