import Link from "next/link";
import BuyerShell from "@/components/buyer/BuyerShell";
import OrderReceiptActions from "@/components/buyer/OrderReceiptActions";
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
  deliveryName?: string;
  deliveryPhone?: string;
  deliveryAddress?: string;
  deliverySlot?: string;
  createdAt: string;
  items?: OrderItem[];
};

type OrderResponse = {
  success: boolean;
  data: Order;
};

function formatPrice(value: number | string) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "0";
  return Math.round(numeric).toString();
}

export default async function BuyerOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (params.id === "undefined") {
    return (
      <BuyerShell>
        <div className="flex flex-col gap-6">
          <header className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Order details
            </p>
            <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
              Order not found
            </h1>
          </header>
          <p className="text-sm text-zinc-600">
            We could not locate that order. Please open the latest order from
            your history.
          </p>
          <Link
            className="text-sm font-semibold text-amber-700"
            href="/buyer/orders"
          >
            ← Back to orders
          </Link>
        </div>
      </BuyerShell>
    );
  }
  const session = await requireRole("buyer");
  const token = session.token ?? "";

  let order: Order | null = null;
  let errorMessage = "";
  try {
    const response = await apiFetch<OrderResponse>(`/buyer/orders/${params.id}`, {
      token,
    });
    order = response.data;
  } catch (error) {
    order = null;
    errorMessage =
      error instanceof Error ? error.message : "Unable to load order.";
  }

  return (
    <BuyerShell notificationRole="buyer" notificationUserId={session.userId}>
      <div className="flex flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Order details
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
            {order ? `Order ${order.id}` : "Order not found"}
          </h1>
          <p className="text-sm text-zinc-700">
            Review items and payment status for this order.
          </p>
        </header>

        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
          {order ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    Status: {order.status}
                  </p>
                  <p className="text-xs text-zinc-600">
                    Placed {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-600">
                    Payment: {order.paymentMethod ?? "COD"}
                  </p>
                  <p className="text-xs text-zinc-600">
                    Delivery: {order.deliveryAddress ?? "N/A"}
                  </p>
                  <p className="text-xs text-zinc-600">
                    Recipient: {order.deliveryName ?? "N/A"} •{" "}
                    {order.deliveryPhone ?? "N/A"}
                  </p>
                  <p className="text-xs text-zinc-600">
                    Slot: {order.deliverySlot ?? "N/A"}
                  </p>
                </div>
                <span className="text-sm font-semibold text-zinc-900">
                  Total: Tk {formatPrice(order.total)}
                </span>
              </div>

              <div className="space-y-3">
                {(order.items ?? []).map((item) => (
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
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-zinc-600">
              <p>We could not load this order.</p>
              {errorMessage ? (
                <p className="text-xs text-rose-500">{errorMessage}</p>
              ) : null}
            </div>
          )}
        </div>

        {order ? (
          <OrderReceiptActions
            order={{
              id: order.id,
              createdAt: order.createdAt,
              paymentMethod: order.paymentMethod,
              total: order.total,
              deliveryName: order.deliveryName,
              deliveryPhone: order.deliveryPhone,
              deliveryAddress: order.deliveryAddress,
              deliverySlot: order.deliverySlot,
              items: (order.items ?? []).map((item) => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })),
            }}
          />
        ) : null}

        <Link className="text-sm font-semibold text-amber-700" href="/buyer/orders">
          ← Back to orders
        </Link>
      </div>
    </BuyerShell>
  );
}
