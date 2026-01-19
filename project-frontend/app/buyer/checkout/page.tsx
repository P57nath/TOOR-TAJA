import BuyerShell from "@/components/buyer/BuyerShell";
import BuyerCheckoutClient from "@/components/buyer/BuyerCheckoutClient";
import { requireRole } from "@/lib/auth";

export default async function BuyerCheckoutPage() {
  const session = await requireRole("buyer");

  return (
    <BuyerShell notificationRole="buyer" notificationUserId={session.userId}>
      <div className="flex flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Checkout
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
            Confirm delivery and payment
          </h1>
          <p className="text-sm text-zinc-700">
            Provide delivery details before placing the order.
          </p>
        </header>

        <BuyerCheckoutClient />
      </div>
    </BuyerShell>
  );
}
