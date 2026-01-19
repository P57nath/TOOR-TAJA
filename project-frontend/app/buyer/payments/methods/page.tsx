import BuyerShell from "@/components/buyer/BuyerShell";
import { requireRole } from "@/lib/auth";

export default async function BuyerPaymentMethodsPage() {
  const session = await requireRole("buyer");

  return (
    <BuyerShell notificationRole="buyer" notificationUserId={session.userId}>
      <div className="flex flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Payments
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
            Payment methods
          </h1>
          <p className="text-sm text-zinc-700">
            Saved payment methods will appear here once integrations are
            enabled.
          </p>
        </header>

        <div className="rounded-3xl border border-amber-100 bg-white p-6 text-sm text-zinc-700 shadow-sm">
          No payment methods connected yet.
        </div>
      </div>
    </BuyerShell>
  );
}
