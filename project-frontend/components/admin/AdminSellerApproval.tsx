"use client";

import { useEffect, useState } from "react";

type SellerProfile = {
  id: string;
  storeName: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED";
  phone?: string | null;
  user?: {
    id: string;
    email: string;
    isActive?: boolean;
  };
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
};

const statusTabs: Array<SellerProfile["status"] | "ALL"> = [
  "ALL",
  "PENDING",
  "APPROVED",
  "SUSPENDED",
];

export default function AdminSellerApproval() {
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusTabs)[number]>("PENDING");
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadSellers(nextStatus = statusFilter) {
    setLoading(true);
    setMessage("");
    try {
      const url = new URL("/api/admin/sellers", window.location.origin);
      if (nextStatus !== "ALL") {
        url.searchParams.set("status", nextStatus);
      }
      const response = await fetch(url.toString(), { cache: "no-store" });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to load sellers.");
      }
      const payload = (await response.json()) as ApiResponse<SellerProfile[]>;
      setSellers(payload.data ?? []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load sellers.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSellers();
  }, [statusFilter]);

  async function handleAction(id: string, action: "approve" | "suspend") {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/sellers/${id}/${action}`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to update seller.");
      }
      await loadSellers();
      setMessage(`Seller ${action}d.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update seller.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Seller approvals
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Approve or suspend seller storefronts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((status) => (
            <button
              key={status}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                statusFilter === status
                  ? "bg-indigo-600 text-white"
                  : "border border-indigo-200 text-indigo-600 hover:border-indigo-300"
              }`}
              type="button"
              onClick={() => setStatusFilter(status)}
            >
              {status === "ALL" ? "All" : status}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Loading sellers...</p>
        ) : sellers.length ? (
          sellers.map((seller) => (
            <div
              key={seller.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {seller.storeName}
                </p>
                <p className="text-xs text-slate-500">
                  {seller.user?.email ?? "No email"} · {seller.status}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {seller.status !== "APPROVED" ? (
                  <button
                    className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-400"
                    type="button"
                    onClick={() => handleAction(seller.id, "approve")}
                    disabled={loading}
                  >
                    Approve
                  </button>
                ) : null}
                {seller.status !== "SUSPENDED" ? (
                  <button
                    className="rounded-full border border-rose-200 px-4 py-1.5 text-xs font-semibold text-rose-500 transition hover:border-rose-300"
                    type="button"
                    onClick={() => handleAction(seller.id, "suspend")}
                    disabled={loading}
                  >
                    Suspend
                  </button>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No sellers found.</p>
        )}
      </div>

      {message ? (
        <p className="mt-4 text-sm font-semibold text-indigo-600">
          {message}
        </p>
      ) : null}
    </section>
  );
}
