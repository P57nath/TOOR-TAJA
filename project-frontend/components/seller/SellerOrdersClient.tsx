"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  name: string;
  price: number | string;
  quantity: number;
};

type Order = {
  id: string;
  status: string;
  createdAt: string;
  paymentMethod?: string;
  items?: OrderItem[];
  deliveryName?: string;
  deliveryPhone?: string;
  deliveryAddress?: string;
  deliverySlot?: string;
};

type OrdersResponse = {
  success: boolean;
  data: Order[];
};

function formatPrice(value: number | string) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "0";
  return Math.round(numeric).toString();
}

function totalFor(items: OrderItem[] = []) {
  return items.reduce((sum, item) => {
    const price = typeof item.price === "number" ? item.price : Number(item.price);
    return sum + price * item.quantity;
  }, 0);
}

function getNextStatuses(order: Order) {
  if (order.paymentMethod === "COD") {
    if (order.status === "CREATED") return ["PROCESSING"];
  }
  if (order.status === "PAID") return ["PROCESSING"];
  if (order.status === "PROCESSING") return ["SHIPPED"];
  if (order.status === "SHIPPED") return ["DELIVERED"];
  return [];
}

export default function SellerOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadOrders() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/seller/orders", { cache: "no-store" });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to load orders.");
      }
      const payload = (await response.json()) as OrdersResponse;
      setOrders(payload.data ?? []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load orders.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, status: string) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/seller/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to update status.");
      }
      await loadOrders();
      setMessage("Order status updated.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update status.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">
            Incoming orders
          </h2>
          <p className="text-sm text-zinc-600">
            Update fulfillment stages as you pack and ship.
          </p>
        </div>
        <button
          className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700"
          type="button"
          onClick={loadOrders}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {message ? (
        <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p>
      ) : null}

      <div className="mt-6 space-y-4">
        {orders.length ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-5"
            >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      Order {order.id}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {order.deliveryAddress ?? "No address provided"}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {order.deliveryName ?? "Unknown"} •{" "}
                      {order.deliveryPhone ?? "N/A"} •{" "}
                      {order.deliverySlot ?? "No slot"}
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-zinc-900">
                    Tk {formatPrice(totalFor(order.items ?? []))}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-600">
                  <span className="rounded-full border border-emerald-200 bg-white px-3 py-1">
                    {order.paymentMethod ?? "COD"}
                  </span>
                </div>

              <div className="mt-4 space-y-2">
                {(order.items ?? []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-xs text-zinc-700"
                  >
                    <span className="font-semibold text-zinc-900">
                      {item.name}
                    </span>
                    <span>
                      Tk {formatPrice(item.price)} × {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {getNextStatuses(order).map((status) => (
                  <button
                    key={status}
                    className="rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700"
                    type="button"
                    onClick={() => updateStatus(order.id, status)}
                    disabled={loading}
                  >
                    Mark {status.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-600">No orders yet.</p>
        )}
      </div>
    </section>
  );
}
