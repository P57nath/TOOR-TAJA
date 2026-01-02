"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import Navbar from "@/components/Navbar";

type BuyerShellProps = {
  children: ReactNode;
};

const buyerMenu = [
  { label: "Favourites", icon: "❤️" },
  { label: "Winter Collection", icon: "❄️" },
  { label: "Flash Sales", icon: "⚡" },
  { label: "Food", icon: "🧺", hasChevron: true },
  { label: "Cleaning Supplies", icon: "🧴", hasChevron: true },
  { label: "Home & Kitchen", icon: "🏠", hasChevron: true },
  { label: "Fashion & Lifestyle", icon: "👗", hasChevron: true },
  { label: "Baby Care", icon: "🍼", hasChevron: true },
  { label: "Personal Care", icon: "🧴", hasChevron: true },
  { label: "Stationery & Office", icon: "📚", hasChevron: true },
  { label: "Pet Care", icon: "🐾", hasChevron: true },
  { label: "Toys & Sports", icon: "🧸", hasChevron: true },
];

export default function BuyerShell({ children }: BuyerShellProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-amber-50 text-zinc-900">
      <Navbar
        onMenuToggle={() => setIsNavOpen((open) => !open)}
        isMenuOpen={isNavOpen}
        showMenuButton
        showSearch
        showAuthButton={false}
        showUserActions
        searchPlaceholder="Search for products (e.g. eggs, milk, potato)"
        logoRefreshOnClick
      />

      <main className="relative mx-auto flex w-full max-w-6xl gap-6 px-6 pb-10 pt-8 sm:pb-14 sm:pt-10">
        {isNavOpen ? (
          <div className="fixed left-0 right-0 top-[68px] z-40 flex h-[calc(100vh-68px)]">
            <button
              className="absolute inset-0 bg-zinc-900/20"
              type="button"
              aria-label="Close navigation"
              onClick={() => setIsNavOpen(false)}
            />
            <aside className="relative h-full w-56 bg-transparent px-2 py-4 shadow-xl backdrop-blur-md">
              <div className="sidebar-scroll flex max-h-full flex-col gap-1 overflow-y-auto px-1 pt-5">
                {buyerMenu.map((item) => (
                  <button
                    key={item.label}
                    className="flex w-full items-center justify-between rounded-2xl border border-zinc-900/10 bg-white/80 px-3 py-2 text-[11px] font-semibold leading-tight text-zinc-900 shadow-sm transition hover:-translate-y-0.5"
                    type="button"
                    aria-label={item.label}
                    title={item.label}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    {item.hasChevron ? (
                      <span className="text-xs text-zinc-500">{">"}</span>
                    ) : null}
                  </button>
                ))}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/80 px-3 py-1.5 text-[11px] font-semibold shadow-sm"
                    type="button"
                  >
                    <span className="text-pink-500">?</span>
                    Help
                  </button>
                  <button
                    className="flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/80 px-3 py-1.5 text-[11px] font-semibold shadow-sm"
                    type="button"
                  >
                    <span className="text-rose-500">!</span>
                    Complaint
                  </button>
                </div>
              </div>
            </aside>
          </div>
        ) : null}

        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
