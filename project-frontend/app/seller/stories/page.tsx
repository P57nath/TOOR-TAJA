import SellerStoriesClient from "@/components/seller/SellerStoriesClient";
import { requireRole } from "@/lib/auth";

export default async function SellerStoriesPage() {
  const session = await requireRole("seller");
  const token = session.token ?? "";
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010";

  return (
    <div className="flex flex-col gap-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
          Seller stories
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
          Share daily promotions
        </h1>
        <p className="max-w-2xl text-zinc-700">
          Upload a story image for buyers. Submissions require admin approval
          before they go live.
        </p>
      </header>

      <SellerStoriesClient token={token} apiBaseUrl={apiBaseUrl} />
    </div>
  );
}
