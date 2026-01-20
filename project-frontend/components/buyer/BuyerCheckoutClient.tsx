"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  productId: string;
  name: string;
  price: number | string;
  quantity: number;
};

type CartData = {
  items: CartItem[];
};

type OrderResponse = {
  success: boolean;
  data?: {
    order?: { id: string };
    paymentIntent?: { id: string; orderId?: string };
    gatewayUrl?: string | null;
    adjustments?: Array<{
      productId: string;
      name: string;
      requested: number;
      available: number;
      adjusted: number;
    }>;
  };
  message?: string;
};

type OrdersListResponse = {
  success: boolean;
  data: Array<{ id?: string }>;
};

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

export default function BuyerCheckoutClient() {
  const [cart, setCart] = useState<CartData>({ items: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadCart() {
      setLoading(true);
      setMessage("");
      try {
        const response = await fetch("/api/buyer/cart", { cache: "no-store" });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Unable to load cart.");
        }
        const payload = await response.json();
        setCart(payload.data ?? { items: [] });
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Unable to load cart.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCart();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!cart.items.length) {
      setMessage("Your cart is empty.");
      return;
    }
    if (
      !deliveryName.trim() ||
      !deliveryPhone.trim() ||
      !deliveryAddress.trim() ||
      !deliverySlot.trim()
    ) {
      setMessage("Please complete name, phone, address, and delivery slot.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/buyer/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          paymentMethod,
          deliveryName: deliveryName.trim(),
          deliveryPhone: deliveryPhone.trim(),
          deliveryAddress: deliveryAddress.trim(),
          deliverySlot: deliverySlot.trim(),
          note: deliveryNote.trim() || undefined,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to place order.");
      }
      const payload = (await response.json()) as OrderResponse;
      const adjustments = payload.data?.adjustments ?? [];
      if (adjustments.length) {
        const lines = adjustments
          .map(
            (item) =>
              `${item.name}: requested ${item.requested}, available ${item.available}, ordered ${item.adjusted}`,
          )
          .join(" | ");
        setMessage(`Stock adjusted. ${lines}`);
      }
      const orderIdRaw =
        payload.data?.order?.id ?? payload.data?.paymentIntent?.orderId;
      const orderId =
        orderIdRaw && orderIdRaw !== "undefined" ? orderIdRaw : "";
      const gatewayUrl = payload.data?.gatewayUrl;
      if (paymentMethod === "ONLINE" && gatewayUrl) {
        window.location.href = gatewayUrl;
        return;
      }
      if (!orderId) {
        try {
          const listResponse = await fetch("/api/buyer/orders?limit=1", {
            cache: "no-store",
          });
          if (listResponse.ok) {
            const listPayload =
              (await listResponse.json()) as OrdersListResponse;
            const latestId = listPayload.data?.[0]?.id;
            if (latestId) {
              router.push(`/buyer/orders/${latestId}`);
              return;
            }
          }
        } catch {
          // ignore and fall through to message
        }
        setMessage("Order created, but we could not find the order ID.");
        router.push("/buyer/orders");
        return;
      }
      router.push(`/buyer/orders/${orderId}`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to place order.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
      <form
        className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">
            Delivery details
          </h2>
          <p className="text-sm text-zinc-600">
            Tell us where and when to deliver your order.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            Full name
            <input
              className="rounded-2xl border border-amber-100 bg-amber-50/40 px-4 py-3 text-sm text-zinc-900 outline-none"
              value={deliveryName}
              onChange={(event) => setDeliveryName(event.target.value)}
              placeholder="Recipient name"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            Phone
            <input
              className="rounded-2xl border border-amber-100 bg-amber-50/40 px-4 py-3 text-sm text-zinc-900 outline-none"
              value={deliveryPhone}
              onChange={(event) => setDeliveryPhone(event.target.value)}
              placeholder="01XXXXXXXXX"
            />
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-2 text-sm text-zinc-700">
          Delivery address
          <textarea
            className="min-h-[110px] rounded-2xl border border-amber-100 bg-amber-50/40 px-4 py-3 text-sm text-zinc-900 outline-none"
            value={deliveryAddress}
            onChange={(event) => setDeliveryAddress(event.target.value)}
            placeholder="House, road, area"
          />
        </label>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            Delivery slot
            <input
              className="rounded-2xl border border-amber-100 bg-amber-50/40 px-4 py-3 text-sm text-zinc-900 outline-none"
              value={deliverySlot}
              onChange={(event) => setDeliverySlot(event.target.value)}
              placeholder="Today 6pm-9pm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-zinc-700">
            Note (optional)
            <input
              className="rounded-2xl border border-amber-100 bg-amber-50/40 px-4 py-3 text-sm text-zinc-900 outline-none"
              value={deliveryNote}
              onChange={(event) => setDeliveryNote(event.target.value)}
              placeholder="Gate code, instructions"
            />
          </label>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-zinc-700">Payment method</p>
          <div className="mt-2 flex gap-3">
            <button
              className={`flex-1 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                paymentMethod === "COD"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-white text-zinc-600"
              }`}
              type="button"
              onClick={() => setPaymentMethod("COD")}
            >
              Cash on delivery
            </button>
            <button
              className={`flex-1 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                paymentMethod === "ONLINE"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-white text-zinc-600"
              }`}
              type="button"
              onClick={() => setPaymentMethod("ONLINE")}
            >
              Pay online (SSLCOMMERZ)
            </button>
          </div>
        </div>

        {message ? (
          <p className="mt-4 text-sm font-semibold text-rose-500">{message}</p>
        ) : null}

        <button
          className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          type="submit"
          disabled={loading}
        >
          {loading ? "Placing order..." : "Place order"}
        </button>
      </form>

      <aside className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-zinc-900">Order summary</h3>
        <p className="text-sm text-zinc-600">Review your items before paying.</p>

        <div className="mt-4 space-y-3">
          {cart.items.length ? (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/40 px-4 py-3 text-sm text-zinc-700"
              >
                <div>
                  <p className="font-semibold text-zinc-900">{item.name}</p>
                  <p className="text-xs text-zinc-500">
                    Tk {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-zinc-900">
                  Tk {formatPrice(Number(item.price) * item.quantity)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-600">Your cart is empty.</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm font-semibold text-zinc-900">
          <span>Total</span>
          <span>Tk {formatPrice(calculateTotal(cart.items))}</span>
        </div>
      </aside>
    </div>
  );
}
