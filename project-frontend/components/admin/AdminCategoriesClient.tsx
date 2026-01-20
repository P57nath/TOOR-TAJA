"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  isActive?: boolean;
  subcategories?: Array<{ id: string; name: string; imagePath?: string | null }>;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
};

export default function AdminCategoriesClient() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010";
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategoryInput, setSubcategoryInput] = useState<Record<string, string>>(
    {},
  );
  const [subcategoryImage, setSubcategoryImage] = useState<
    Record<string, File | null>
  >({});
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

  async function handleAddSubcategory(categoryId: string) {
    const name = subcategoryInput[categoryId]?.trim();
    if (!name) {
      setMessage("Subcategory name is required.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.set("name", name);
      const image = subcategoryImage[categoryId];
      if (image) {
        formData.set("image", image);
      }
      const response = await fetch(
        `/api/admin/categories/${categoryId}/subcategories`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to create subcategory.");
      }
      setSubcategoryInput((prev) => ({ ...prev, [categoryId]: "" }));
      setSubcategoryImage((prev) => ({ ...prev, [categoryId]: null }));
      await loadCategories();
      setMessage("Subcategory created.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to create subcategory.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSubcategory(subcategoryId: string) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/admin/subcategories/${subcategoryId}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to delete subcategory.");
      }
      await loadCategories();
      setMessage("Subcategory deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete subcategory.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <form
        className="h-fit rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold text-zinc-900">
          Create category
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Add a top-level group for your store navigation.
        </p>
        <div className="mt-5 space-y-3">
          <label className="flex flex-col gap-2 text-xs font-semibold text-zinc-700">
            Category name
            <input
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-300"
              placeholder="e.g., Foods"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <button
            className="w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add category"}
          </button>
          {message ? (
            <p className="text-sm font-semibold text-emerald-700">
              {message}
            </p>
          ) : null}
        </div>
      </form>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              Categories & subcategories
            </h3>
            <p className="text-sm text-zinc-600">
              Manage subcategory lists and images for each category.
            </p>
          </div>
          <span className="rounded-full border border-emerald-100 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
            {categories.length} categories
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {category.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {(category.subcategories ?? []).length} subcategories
                  </p>
                </div>
                <button
                  className="text-xs font-semibold text-rose-500 transition hover:text-rose-600"
                  type="button"
                  onClick={() => handleDelete(category.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {(category.subcategories ?? []).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-2xl border border-emerald-50 bg-emerald-50/40 px-3 py-2 text-xs text-emerald-900"
                  >
                    <div className="flex items-center gap-2">
                      {sub.imagePath ? (
                        <img
                          alt={sub.name}
                          className="h-7 w-7 rounded-full object-cover"
                          src={`${apiBaseUrl}/products/subcategories/image/${sub.imagePath}`}
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-emerald-100" />
                      )}
                      <span className="font-semibold">{sub.name}</span>
                    </div>
                    <button
                      className="text-[11px] font-semibold text-emerald-700"
                      type="button"
                      onClick={() => handleDeleteSubcategory(sub.id)}
                      disabled={loading}
                      aria-label={`Delete ${sub.name}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {!category.subcategories?.length ? (
                  <p className="text-xs text-zinc-500">
                    No subcategories yet.
                  </p>
                ) : null}
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3">
                <p className="text-xs font-semibold text-emerald-700">
                  Add subcategory
                </p>
                 <input
                    className="rounded-2xl border border-emerald-100 bg-white px-2 py-1 text-xs text-zinc-900 file:mr-2 file:rounded-full file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) =>
                      setSubcategoryImage((prev) => ({
                        ...prev,
                        [category.id]: event.target.files?.[0] ?? null,
                      }))
                    }
                  />
                <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input
                    className="rounded-2xl border border-emerald-100 bg-white px-1 py-2 text-xs text-zinc-900 outline-none transition focus:border-emerald-300"
                    placeholder="Subcategory name"
                    value={subcategoryInput[category.id] ?? ""}
                    onChange={(event) =>
                      setSubcategoryInput((prev) => ({
                        ...prev,
                        [category.id]: event.target.value,
                      }))
                    }
                  />
                 
                  <button
                    className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
                    type="button"
                    onClick={() => handleAddSubcategory(category.id)}
                    disabled={loading}
                  >
                    Add subcategory
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!categories.length ? (
          <p className="text-sm text-zinc-500">
            No categories yet. Add the first category to begin.
          </p>
        ) : null}
      </section>
    </div>
  );
}
