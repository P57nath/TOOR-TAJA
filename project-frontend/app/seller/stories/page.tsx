import SellerStoriesClient from "@/components/seller/SellerStoriesClient";
import { requireRole } from "@/lib/auth";

export default async function SellerStoriesPage() {
  const session = await requireRole("seller");
  const token = session.token ?? "";
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16 sm:py-20">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            Seller stories
          </p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Share daily promotions
          </h1>
          <p className="max-w-2xl text-white/70">
            Upload a story image for buyers. Submissions require admin approval
            before they go live.
          </p>
        </header>

        <SellerStoriesClient token={token} apiBaseUrl={apiBaseUrl} />
      </main>
    </div>
  );
}
