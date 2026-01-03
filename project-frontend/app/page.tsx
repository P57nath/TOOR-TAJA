"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const dynamic = "force-static";

const sidebarItems = [
  {
    label: "Favourites",
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
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    ),
  },
  {
    label: "Winter Collection",
    icon: (
      <svg
        className="h-4 w-4 text-sky-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20" />
        <path d="M4 6l16 12" />
        <path d="M20 6L4 18" />
      </svg>
    ),
  },
  {
    label: "Flash Sales",
    icon: (
      <svg
        className="h-4 w-4 text-amber-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    label: "Food",
    hasChevron: true,
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
        <path d="M3 7h18" />
        <path d="M5 7l1 13h12l1-13" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
    ),
  },
  {
    label: "Cleaning Supplies",
    hasChevron: true,
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
        <path d="M9 3h6l1 4H8l1-4z" />
        <path d="M7 7h10l-1 14H8L7 7z" />
      </svg>
    ),
  },
  {
    label: "Home & Kitchen",
    hasChevron: true,
    icon: (
      <svg
        className="h-4 w-4 text-emerald-700"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    label: "Fashion & Lifestyle",
    hasChevron: true,
    icon: (
      <svg
        className="h-4 w-4 text-pink-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 3l3 3 3-3 3 4-3 4v10H9V10L6 7l3-4z" />
      </svg>
    ),
  },
  {
    label: "Baby Care",
    hasChevron: true,
    icon: (
      <svg
        className="h-4 w-4 text-rose-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </svg>
    ),
  },
  {
    label: "Personal Care",
    hasChevron: true,
    icon: (
      <svg
        className="h-4 w-4 text-teal-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </svg>
    ),
  },
  {
    label: "Stationery & Office",
    hasChevron: true,
    icon: (
      <svg
        className="h-4 w-4 text-indigo-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h12v16H4z" />
        <path d="M8 4v16" />
        <path d="M16 7h4v13h-4" />
      </svg>
    ),
  },
  {
    label: "Pet Care",
    hasChevron: true,
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
        <circle cx="7" cy="7" r="2" />
        <circle cx="17" cy="7" r="2" />
        <circle cx="5" cy="13" r="2" />
        <circle cx="19" cy="13" r="2" />
        <path d="M12 12a4 4 0 0 0-4 4 4 4 0 0 0 8 0 4 4 0 0 0-4-4z" />
      </svg>
    ),
  },
  {
    label: "Toys & Sports",
    hasChevron: true,
    icon: (
      <svg
        className="h-4 w-4 text-orange-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16" />
        <path d="M12 4a16 16 0 0 0 0 16" />
        <path d="M12 4a16 16 0 0 1 0 16" />
      </svg>
    ),
  },
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<{ items: any[] }>({ items: [] });
  const [cartMessage, setCartMessage] = useState("");
  const [cartLoading, setCartLoading] = useState(false);
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

  useEffect(() => {
    if (!isCartOpen) return;
    void loadCart();
  }, [isCartOpen]);

  useEffect(() => {
    void loadCart();
  }, []);

  useEffect(() => {
    function handleCartUpdated() {
      void loadCart();
    }
    window.addEventListener("cart:updated", handleCartUpdated);
    return () => window.removeEventListener("cart:updated", handleCartUpdated);
  }, []);

  function formatPrice(value: number | string) {
    const numeric = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(numeric)) return "0";
    return Math.round(numeric).toString();
  }

  function calculateTotal(items: any[]) {
    return items.reduce((sum, item) => {
      const price = typeof item.price === "number" ? item.price : Number(item.price);
      return sum + price * item.quantity;
    }, 0);
  }

  async function loadCart() {
    setCartLoading(true);
    setCartMessage("");
    try {
      const response = await fetch("/api/buyer/cart", { cache: "no-store" });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to load cart.");
      }
      const payload = await response.json();
      setCart(payload.data ?? { items: [] });
    } catch (error) {
      setCartMessage(
        error instanceof Error ? error.message : "Unable to load cart.",
      );
    } finally {
      setCartLoading(false);
    }
  }

  async function updateCartItem(itemId: number, quantity: number) {
    if (!Number.isFinite(Number(itemId))) {
      setCartMessage("Please reopen the cart to refresh items.");
      return;
    }
    if (quantity < 1) return;
    setCartLoading(true);
    try {
      const response = await fetch(`/api/buyer/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to update item.");
      }
      await loadCart();
    } catch (error) {
      setCartMessage(
        error instanceof Error ? error.message : "Unable to update item.",
      );
    } finally {
      setCartLoading(false);
    }
  }

  async function removeCartItem(itemId: number) {
    if (!Number.isFinite(Number(itemId))) {
      setCartMessage("Please reopen the cart to refresh items.");
      return;
    }
    setCartLoading(true);
    try {
      const response = await fetch(`/api/buyer/cart/items/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to remove item.");
      }
      await loadCart();
    } catch (error) {
      setCartMessage(
        error instanceof Error ? error.message : "Unable to remove item.",
      );
    } finally {
      setCartLoading(false);
    }
  }

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

        <main
          className={`relative mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-full gap-6 px-3 pb-16 pt-6 transition-all duration-300 sm:px-4 ${
            isNavOpen ? "lg:pl-[240px]" : ""
          } ${isCartOpen ? "lg:pr-[360px]" : ""}`}
        >
          <aside
            className={`fixed left-0 top-[68px] z-40 h-[calc(100vh-68px)] w-56 bg-transparent px-2 py-4 shadow-xl backdrop-blur-md transition-transform duration-300 ${
              isNavOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="sidebar-scroll flex max-h-full flex-col gap-1 overflow-y-auto pt-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  className="flex w-full items-center justify-between rounded-2xl border border-zinc-900/10 bg-white/70 px-3 py-2 text-[11px] font-semibold leading-tight text-zinc-900 shadow-sm transition hover:-translate-y-0.5 backdrop-blur-md"
                  type="button"
                  aria-label={item.label}
                  title={item.label}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-4 w-4 items-center justify-center">
                      {item.icon}
                    </span>
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

          <section className="flex-1">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
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
            className="fixed z-30 w-24 select-none"
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
                <span className="text-[10px] text-zinc-700">BDT</span> 0
              </p>
              <button
                className="mt-3 w-full rounded-full bg-emerald-600 px-3 py-2 text-[10px] font-semibold text-white"
                type="button"
                onClick={() => setIsCartOpen(true)}
              >
                View cart
              </button>
            </div>
          </div>

          <div
            className={`fixed top-[68px] z-40 h-[calc(100vh-68px)] w-full max-w-[340px] border-l border-zinc-900/10 bg-white shadow-2xl transition-all duration-300 ${
              isCartOpen ? "right-0" : "-right-[360px]"
            }`}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-zinc-900/10 bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-700" aria-hidden>
                    <svg
                      className="h-5 w-5"
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
                  <span>{cart.items.length} items</span>
                </div>
                <button
                  className="rounded border border-zinc-400 px-3 py-1 text-xs font-semibold text-zinc-700"
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-900/10 bg-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700">
                <span>Delivery charge not needed</span>
                <span>Tk 0</span>
              </div>

              <div className="flex items-center gap-2 border-b border-zinc-900/10 bg-white px-4 py-2 text-xs font-semibold text-zinc-700">
                <span className="text-zinc-800">Express Delivery</span>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-zinc-700">
                {cartLoading ? (
                  <p className="text-xs text-zinc-500">Loading cart...</p>
                ) : cart.items.length ? (
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3"
                      >
                        <div className="flex flex-1 items-center gap-3">
                          <div className="flex flex-col items-center gap-1">
                            <button
                              className="text-xs font-semibold text-zinc-500"
                              type="button"
                              onClick={() =>
                                updateCartItem(item.id, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                            <span className="text-sm font-semibold text-zinc-800">
                              {item.quantity}
                            </span>
                            <button
                              className="text-xs font-semibold text-zinc-500"
                              type="button"
                              onClick={() =>
                                updateCartItem(
                                  item.id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                            >
                              -
                            </button>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-zinc-800">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-zinc-500">
                              Tk {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                        <button
                          className="text-sm font-semibold text-zinc-400"
                          type="button"
                          onClick={() => removeCartItem(item.id)}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">Your cart is empty.</p>
                )}
                {cartMessage ? (
                  <p className="mt-3 text-xs font-semibold text-rose-500">
                    {cartMessage}
                  </p>
                ) : null}
              </div>

              <div className="border-t border-zinc-900/10 bg-white px-4 py-3">
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700"
                  type="button"
                >
                  Have a special code?
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-900/10">
                <button
                  className="flex-1 bg-rose-400 px-4 py-3 text-sm font-semibold text-white"
                  type="button"
                >
                  Place order
                </button>
                <div className="flex w-32 items-center justify-center bg-rose-500 px-3 py-3 text-sm font-semibold text-white">
                  Tk {formatPrice(calculateTotal(cart.items))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
