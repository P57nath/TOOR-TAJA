import BuyerShell from "@/components/buyer/BuyerShell";
import { requireRole } from "@/lib/auth";

export default async function BuyerProfilePage() {
  const session = await requireRole("buyer");

  return (
    <BuyerShell>
      <div className="space-y-6">
        <header className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Your profile
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-amber-950">
            Account overview
          </h1>
          <p className="mt-2 text-sm text-amber-900/70">
            Manage your account details and keep your info up to date.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Identity
            </p>
            <p className="mt-4 text-sm text-amber-900/70">
              Name: {session.displayName || "Not available"}
            </p>
            <p className="text-sm text-amber-900/70">
              Email: {session.email || "Not available"}
            </p>
            <p className="text-sm text-amber-900/70">
              Role: {session.role}
            </p>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Account
            </p>
            <p className="mt-4 text-sm text-amber-900/70">
              Buyer ID: {session.userId || "Not available"}
            </p>
            <p className="text-sm text-amber-900/70">
              Status: Active
            </p>
          </div>
        </section>
      </div>
    </BuyerShell>
  );
}
