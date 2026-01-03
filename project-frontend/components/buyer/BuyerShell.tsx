"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import Navbar from "@/components/Navbar";

type BuyerShellProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  productId: string;
  name: string;
  price: number | string;
  quantity: number;
};

type CartData = {
  items: CartItem[];
  coupon?: string | null;
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartData>({ items: [] });
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

  function calculateTotal(items: CartItem[]) {
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

      <main
        className={`relative mx-auto flex w-full max-w-6xl gap-6 px-6 pb-10 pt-8 transition-all duration-300 sm:pb-14 sm:pt-10 ${
          isCartOpen ? "lg:pr-[360px]" : ""
        }`}
      >
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
                {cart.items.length} items
              </p>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1 text-sm font-semibold text-zinc-900">
              <span className="text-[10px] text-zinc-700">BDT</span>{" "}
              {formatPrice(calculateTotal(cart.items))}
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
  );
}
