"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const dynamic = "force-static";

const sidebarItems = [
  { label: "Vegetables", icon: "??" },
  { label: "Fruits", icon: "??" },
  { label: "Meat", icon: "??" },
  { label: "Dairy", icon: "??" },
  { label: "Bakery", icon: "??" },
  { label: "Pantry", icon: "??" },
];

const featureCards = [
  {
    title: "+15,000 products",
    detail: "to shop from",
    accent: "text-rose-500",
  },
  {
    title: "Pay after",
    detail: "receiving products",
    accent: "text-emerald-600",
  },
  {
    title: "Delivery within",
    detail: "1 hour",
    accent: "text-amber-600",
  },
  {
    title: "Offers that",
    detail: "save money",
    accent: "text-sky-600",
  },
];

const featureIcons = [
  (
    <svg
      key="products"
      className="h-5 w-5 text-rose-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h18" />
      <path d="M5 7l1 13h12l1-13" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  ),
  (
    <svg
      key="pay"
      className="h-5 w-5 text-emerald-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M2 10h20" />
      <path d="M7 14h4" />
    </svg>
  ),
  (
    <svg
      key="delivery"
      className="h-5 w-5 text-amber-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M3 6h12v9H3z" />
      <path d="M15 9h4l2 3v3h-6z" />
    </svg>
  ),
  (
    <svg
      key="offers"
      className="h-5 w-5 text-sky-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M6 3h12l-1 18-5-3-5 3-1-18z" />
    </svg>
  ),
];

const collageImages = [
  { src: "/register-illustration.jpg", alt: "Fresh produce" },
  { src: "/register-illustration.jpg", alt: "Grocery aisle" },
  { src: "/register-illustration.jpg", alt: "Local seller" },
  { src: "/register-illustration.jpg", alt: "Delivery rider" },
  { src: "/register-illustration.jpg", alt: "Market haul" },
];

export default function Home() {
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
    const defaultX = Math.max(window.innerWidth - 180, 24);
    const defaultY = 180;
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
    <div className="min-h-screen bg-[#C5D89D] text-zinc-900">
      <div className="relative">
        <Navbar
          onMenuToggle={() => setIsNavOpen((open) => !open)}
          isMenuOpen={isNavOpen}
          showMenuButton
        />

        <main className="relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-7xl gap-6 px-6 pb-16 sm:px-8">
          {isNavOpen ? (
            <div className="fixed left-0 right-0 top-16 z-40 flex h-[calc(100vh-64px)]">
              <button
                className="absolute inset-0 bg-zinc-900/20"
                type="button"
                aria-label="Close navigation"
                onClick={() => setIsNavOpen(false)}
              />
              <aside className="relative h-full w-20 bg-[#F6F0D7] px-3 py-6 shadow-xl sm:w-24 sm:px-4">
                <div className="flex flex-col items-center gap-4 pt-6">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.label}
                      className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl border border-zinc-900/10 bg-white text-xs font-semibold text-zinc-900 shadow-sm transition hover:-translate-y-0.5"
                      type="button"
                      aria-label={item.label}
                      title={item.label}
                    >
                      <span className="text-lg">{item.icon}</span>
                    </button>
                  ))}
                  <button
                    className="mt-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-900/10 bg-white text-xs font-semibold shadow-sm"
                    type="button"
                    aria-label="Help"
                    title="Help"
                  >
                    ?
                  </button>
                </div>
              </aside>
            </div>
          ) : null}

          <section className="flex-1">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6 pt-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold leading-tight text-zinc-900 sm:text-5xl">
                    Grocery delivered at your doorstep
                  </h1>
                  <p className="max-w-xl text-base text-zinc-800/70">
                    Shop from trusted local sellers, schedule quick delivery, and
                    track every order from basket to doorstep.
                  </p>
                </div>
                <div className="flex w-full max-w-xl items-center rounded-2xl border border-zinc-900/10 bg-white px-4 py-3 shadow-sm">
                  <input
                    className="flex-1 border-none bg-transparent text-sm outline-none"
                    placeholder="Search for products (eggs, milk, potato)"
                    type="search"
                  />
                  <Image
                    src="/search.png"
                    alt="Search"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-zinc-900/10 bg-white/70 px-4 py-2 text-xs font-semibold">
                    Fresh arrivals
                  </span>
                  <span className="rounded-full border border-zinc-900/10 bg-white/70 px-4 py-2 text-xs font-semibold">
                    Same-day delivery
                  </span>
                  <span className="rounded-full border border-zinc-900/10 bg-white/70 px-4 py-2 text-xs font-semibold">
                    Verified sellers
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {collageImages.map((item, index) => (
                  <div
                    key={`${item.alt}-${index}`}
                    className={`relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${
                      index === 0 ? "col-span-2" : ""
                    }`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 220px, 45vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {featureCards.map((card, index) => (
                <div
                  key={card.title}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-900/10 bg-white/80 px-5 py-4 text-sm shadow-sm"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                    {featureIcons[index]}
                  </span>
                  <span>
                    <span className={`font-semibold ${card.accent}`}>
                      {card.title}
                    </span>{" "}
                    {card.detail}
                  </span>
                </div>
              ))}
            </div>
          </section>

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
                isDraggingCart ? "cursor-grabbing ring-1 ring-zinc-900/10" : "cursor-grab"
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
                <span className="text-[10px] text-zinc-700">৳</span> 0
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
      <Footer />
    </div>
  );
}
