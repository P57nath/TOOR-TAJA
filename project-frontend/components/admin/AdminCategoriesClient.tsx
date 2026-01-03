"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  isActive?: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
};

export default function AdminCategoriesClient() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadCategories() {
    try {
      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to load categories.");
      }
      const payload = (await response.json()) as ApiResponse<Category[]>;
      setCategories(payload.data ?? []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load categories.",
      );
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setMessage("Category name is required.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to create category.");
      }
      setName("");
      await loadCategories();
      setMessage("Category created.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to create category.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(categoryId: string) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to delete category.");
      }
      await loadCategories();
      setMessage("Category deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to delete category.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold text-slate-900">Add category</h2>
        <p className="mt-1 text-sm text-slate-600">
          Use a clear merchandising name buyers will recognize.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400"
            placeholder="e.g., Fruits & Vegetables"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save category"}
          </button>
        </div>
        {message ? (
          <p className="mt-3 text-sm font-semibold text-indigo-600">
            {message}
          </p>
        ) : null}
      </form>

      <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          Existing categories
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm text-slate-700"
            >
              <span className="font-semibold text-slate-900">
                {category.name}
              </span>
              <button
                className="text-xs font-semibold text-rose-500 transition hover:text-rose-600"
                type="button"
                onClick={() => handleDelete(category.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        {!categories.length ? (
          <p className="mt-4 text-sm text-slate-500">
            No categories yet. Add the first one above.
          </p>
        ) : null}
      </section>
    </div>
  );
}
