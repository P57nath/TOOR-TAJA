"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

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
  const [cartPos, setCartPos] = useState({ x: 0, y: 0 });
  const [hasCartPosition, setHasCartPosition] = useState(false);
  const [isDraggingCart, setIsDraggingCart] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({
    pointerId: null as number | null,
    originX: 0,
    originY: 0,
    startX: 0,
    startY: 0,
  });

  useEffect(() => {
    if (hasCartPosition) return;
    const element = cartRef.current;
    const width = element?.offsetWidth ?? 120;
    const height = element?.offsetHeight ?? 160;
    const defaultX = Math.max(window.innerWidth - width - 24, 12);
    const defaultY = Math.max((window.innerHeight - height) / 2, 80);
    setCartPos({ x: defaultX, y: defaultY });
    setHasCartPosition(true);
  }, [hasCartPosition]);

  function handleCartPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    const element = cartRef.current;
    if (!element) return;

    dragState.current.pointerId = event.pointerId;
    dragState.current.originX = cartPos.x;
    dragState.current.originY = cartPos.y;
    dragState.current.startX = event.clientX;
    dragState.current.startY = event.clientY;
    setIsDraggingCart(true);
    element.setPointerCapture(event.pointerId);
  }

  function handleCartPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragState.current.pointerId !== event.pointerId) return;
    const element = cartRef.current;
    if (!element) return;

    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;
    const nextX = dragState.current.originX + dx;
    const nextY = dragState.current.originY + dy;

    const maxX = window.innerWidth - element.offsetWidth - 12;
    const maxY = window.innerHeight - element.offsetHeight - 12;
    const clampedX = Math.min(Math.max(12, nextX), maxX);
    const clampedY = Math.min(Math.max(80, nextY), maxY);

    setCartPos({ x: clampedX, y: clampedY });
  }

  function handleCartPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragState.current.pointerId !== event.pointerId) return;
    dragState.current.pointerId = null;
    setIsDraggingCart(false);
  }

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

        <div
          ref={cartRef}
          className="fixed z-30 hidden w-24 select-none lg:block"
          style={{ left: cartPos.x, top: cartPos.y }}
          onPointerDown={handleCartPointerDown}
          onPointerMove={handleCartPointerMove}
          onPointerUp={handleCartPointerUp}
          onPointerCancel={handleCartPointerUp}
        >
          <div
            className={`rounded-3xl border border-zinc-900/10 bg-[#F6F0D7]/50 px-3 py-4 shadow-lg backdrop-blur ${
              isDraggingCart
                ? "cursor-grabbing ring-1 ring-zinc-900/10"
                : "cursor-grab"
            }`}
          >
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2">
              <span className="text-emerald-700" aria-hidden>
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8h12l-1.2 12H7.2L6 8z" />
                  <path d="M9 8a3 3 0 0 1 6 0" />
                </svg>
              </span>
              <p className="text-[10px] font-semibold uppercase text-emerald-700">
                0 items
              </p>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-zinc-900">
              <span className="text-[10px] text-zinc-700">BDT</span> 0
            </p>
            <button
              className="mt-3 w-full rounded-full bg-emerald-600 px-3 py-2 text-[10px] font-semibold text-white"
              type="button"
            >
              View cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
