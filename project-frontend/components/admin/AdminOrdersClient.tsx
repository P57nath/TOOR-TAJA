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
  total: number | string;
  createdAt: string;
  paymentMethod?: string;
  transactionId?: string | null;
  deliveryName?: string;
  deliveryPhone?: string;
  deliveryAddress?: string;
  deliverySlot?: string;
  items?: OrderItem[];
};

type PaymentIntent = {
  id: string;
  orderId: string;
  status: string;
  amount: number | string;
  provider: string;
  createdAt: string;
};

type OrdersResponse = {
  success: boolean;
  data: Order[];
};

type PaymentsResponse = {
  success: boolean;
  data: PaymentIntent[];
};

function formatPrice(value: number | string) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "0";
  return numeric.toFixed(2);
}

function calculateTotal(items: OrderItem[] = []) {
  return items.reduce((sum, item) => {
    const price = typeof item.price === "number" ? item.price : Number(item.price);
    return sum + price * item.quantity;
  }, 0);
}

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentIntent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadAll() {
    setLoading(true);
    setMessage("");
    try {
      const [ordersRes, paymentsRes] = await Promise.all([
        fetch("/api/admin/orders", { cache: "no-store" }),
        fetch("/api/admin/payments", { cache: "no-store" }),
      ]);
      if (!ordersRes.ok) {
        const text = await ordersRes.text();
        throw new Error(text || "Unable to load orders.");
      }
      if (!paymentsRes.ok) {
        const text = await paymentsRes.text();
        throw new Error(text || "Unable to load payments.");
      }
      const ordersPayload = (await ordersRes.json()) as OrdersResponse;
      const paymentsPayload = (await paymentsRes.json()) as PaymentsResponse;
      setOrders(ordersPayload.data ?? []);
      setPayments(paymentsPayload.data ?? []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Order oversight
            </h2>
            <p className="text-sm text-zinc-600">
              Read-only view of order flow controlled by sellers.
            </p>
          </div>
          <button
            className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700"
            type="button"
            onClick={loadAll}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {message ? (
          <p className="mt-4 text-sm font-semibold text-emerald-700">
            {message}
          </p>
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
                      {order.id}
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
                  <span className="text-xs font-semibold text-zinc-700">
                    {order.paymentMethod ?? "COD"}
                  </span>
                  <span className="text-sm font-semibold text-zinc-900">
                    Tk {formatPrice(calculateTotal(order.items ?? []))}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
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

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {order.status}
                  </span>
                  {order.transactionId ? (
                    <span className="text-[11px] text-zinc-500">
                      Payment intent: {order.transactionId}
                    </span>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-600">No orders yet.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Payment intents
          </h2>
          <p className="text-sm text-zinc-600">
            Read-only log of payment intents.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {payments.length ? (
            payments.map((intent) => (
              <div
                key={intent.id}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-xs text-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-zinc-900">{intent.id}</p>
                    <p className="text-[11px] text-zinc-500">
                      Order {intent.orderId} • {intent.provider}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-zinc-900">
                    Tk {formatPrice(intent.amount)}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {intent.status}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {new Date(intent.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-600">No payments yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
