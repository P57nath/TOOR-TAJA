import Link from "next/link";
import BuyerShell from "@/components/buyer/BuyerShell";
import { apiFetch } from "@/lib/api";
import { requireRole } from "@/lib/auth";

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
  paymentMethod?: string;
  createdAt: string;
  items?: OrderItem[];
};

type OrdersResponse = {
  success: boolean;
  data: Order[];
  total?: number;
  page?: number;
  limit?: number;
};

function formatPrice(value: number | string) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "0";
  return Math.round(numeric).toString();
}

export default async function BuyerOrdersPage() {
  const session = await requireRole("buyer");
  const token = session.token ?? "";

  let orders: Order[] = [];
  let total = 0;
  try {
    const response = await apiFetch<OrdersResponse>("/buyer/orders?limit=20", {
      token,
    });
    orders = response.data ?? [];
    total = response.total ?? orders.length;
  } catch {
    orders = [];
  }

  return (
    <BuyerShell notificationRole="buyer" notificationUserId={session.userId}>
      <div className="flex flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Orders
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
            Your order history
          </h1>
          <p className="text-sm text-zinc-700">
            Track every order and see the latest status updates.
          </p>
        </header>

        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900">
              Recent orders
            </p>
            <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {total} total
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {orders.length ? (
              orders
                .filter((order) => Boolean(order.id) && order.id !== "undefined")
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-100 bg-amber-50/40 px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        Order {order.id}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm text-zinc-700">
                      {order.paymentMethod ?? "COD"} • Items{" "}
                      {order.items?.length ?? 0}
                    </div>
                    <div className="text-sm font-semibold text-zinc-900">
                      Tk {formatPrice(order.total)}
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {order.status}
                    </span>
                    <Link
                      className="text-xs font-semibold text-amber-700"
                      href={`/buyer/orders/${order.id}`}
                    >
                      View details →
                    </Link>
                  </div>
                ))
            ) : (
              <p className="text-sm text-zinc-600">No orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </BuyerShell>
  );
}
