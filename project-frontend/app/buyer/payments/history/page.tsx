import BuyerShell from "@/components/buyer/BuyerShell";
import { apiFetch } from "@/lib/api";
import { requireRole } from "@/lib/auth";

type PaymentIntent = {
  id: string;
  orderId: string;
  status: string;
  amount: number | string;
  currency: string;
  createdAt: string;
};

type PaymentsResponse = {
  success: boolean;
  data: PaymentIntent[];
  total?: number;
};

function formatPrice(value: number | string) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "0";
  return Math.round(numeric).toString();
}

export default async function BuyerPaymentHistoryPage() {
  const session = await requireRole("buyer");
  const token = session.token ?? "";

  let intents: PaymentIntent[] = [];
  let total = 0;
  try {
    const response = await apiFetch<PaymentsResponse>("/payments?limit=20", {
      token,
    });
    intents = response.data ?? [];
    total = response.total ?? intents.length;
  } catch {
    intents = [];
  }

  return (
    <BuyerShell notificationRole="buyer" notificationUserId={session.userId}>
      <div className="flex flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Payments
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
            Payment history
          </h1>
          <p className="text-sm text-zinc-700">
            Review recent payment intents and order totals.
          </p>
        </header>

        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900">Latest payments</p>
            <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {total} total
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {intents.length ? (
              intents.map((intent) => (
                <div
                  key={intent.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-amber-50/40 px-4 py-3 text-sm text-zinc-700"
                >
                  <div>
                    <p className="font-semibold text-zinc-900">
                      Payment {intent.id}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Order {intent.orderId} ·{" "}
                      {new Date(intent.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-zinc-900">
                    Tk {formatPrice(intent.amount)}
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {intent.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-600">
                No payments yet. Place your first order to see payments here.
              </p>
            )}
          </div>
        </div>
      </div>
    </BuyerShell>
  );
}
