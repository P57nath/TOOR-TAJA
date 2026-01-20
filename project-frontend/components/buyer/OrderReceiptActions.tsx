"use client";

type ReceiptItem = {
  name: string;
  price: number | string;
  quantity: number;
};

type ReceiptData = {
  id: string;
  createdAt: string;
  paymentMethod?: string;
  total: number | string;
  deliveryName?: string;
  deliveryPhone?: string;
  deliveryAddress?: string;
  deliverySlot?: string;
  items: ReceiptItem[];
};

function formatPrice(value: number | string) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "0";
  return Math.round(numeric).toString();
}

export default function OrderReceiptActions({ order }: { order: ReceiptData }) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            TOOR-TAJA order receipt
          </p>
          <p className="text-xs text-zinc-500">
            Order {order.id} · {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <button
          className="rounded-full border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-700"
          type="button"
          onClick={handlePrint}
        >
          Print / Save PDF
        </button>
      </div>

      <div className="mt-3 grid gap-2 text-xs text-zinc-600">
        <p>
          <span className="font-semibold text-zinc-800">Payment:</span>{" "}
          {order.paymentMethod ?? "COD"}
        </p>
        <p>
          <span className="font-semibold text-zinc-800">Delivery:</span>{" "}
          {order.deliveryAddress ?? "N/A"}
        </p>
        <p>
          <span className="font-semibold text-zinc-800">Recipient:</span>{" "}
          {order.deliveryName ?? "N/A"} ({order.deliveryPhone ?? "N/A"})
        </p>
        <p>
          <span className="font-semibold text-zinc-800">Slot:</span>{" "}
          {order.deliverySlot ?? "N/A"}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {order.items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/40 px-3 py-2 text-xs text-zinc-700"
          >
            <span className="font-semibold text-zinc-900">{item.name}</span>
            <span>
              Tk {formatPrice(item.price)} × {item.quantity}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm font-semibold text-zinc-900">
        <span>Total</span>
        <span>Tk {formatPrice(order.total)}</span>
      </div>
    </div>
  );
}
