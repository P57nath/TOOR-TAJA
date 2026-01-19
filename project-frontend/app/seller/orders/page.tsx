import SellerOrdersClient from "@/components/seller/SellerOrdersClient";
import { requireRole } from "@/lib/auth";

export default async function SellerOrdersPage() {
  await requireRole("seller");

  return (
    <div className="flex flex-col gap-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Seller orders
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
          Fulfill incoming orders
        </h1>
        <p className="max-w-2xl text-zinc-700">
          Review line items and move each order through processing, shipping,
          and delivery.
        </p>
      </header>

      <SellerOrdersClient />
    </div>
  );
}
