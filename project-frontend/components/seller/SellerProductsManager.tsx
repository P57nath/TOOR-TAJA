"use client";

import { useEffect, useMemo, useState } from "react";

type Category = {
  id: string;
  name: string;
  subcategories?: Array<{ id: string; name: string }>;
};

type Product = {
  id: string;
  name: string;
  price: number | string;
  stock?: number;
  description?: string | null;
  imagePath?: string | null;
  unit?: string | null;
  unitValue?: number | string | null;
  subcategoryId?: string | null;
};

type ProductsResponse = {
  success: boolean;
  data: Product[];
};

type SellerProductsManagerProps = {
  categories: Category[];
  imageBaseUrl: string;
};

const unitLabels: Record<string, string> = {
  each: "Each",
  kg: "Kg",
  g: "Gram",
  pcs: "Pcs",
  ml: "Ml",
  L: "Liter",
};

function formatUnit(product: Product) {
  if (product.unit) {
    const value =
      product.unitValue === null || product.unitValue === undefined
        ? ""
        : String(product.unitValue);
    if (product.unit === "each" && !value) return "each";
    if (!value) return product.unit === "L" ? "1 L" : `1 ${product.unit}`;
    return `${value} ${product.unit}`;
  }
  return "each";
}

function formatPrice(value: number | string) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "0";
  return Math.round(numeric).toString();
}

export default function SellerProductsManager({
  categories,
  imageBaseUrl,
}: SellerProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<
    Record<
      string,
      {
        name: string;
        price: string;
        stock: string;
        description: string;
        unit: string;
        unitValue: string;
        subcategoryId: string;
      }
    >
  >({});

  const subcategoryLookup = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, category) => {
      category.subcategories?.forEach((sub) => {
        acc[sub.id] = sub.name;
      });
      return acc;
    }, {});
  }, [categories]);

  async function loadProducts() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/seller/products");
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to load products.");
      }
      const payload = (await response.json()) as ProductsResponse;
      setProducts(payload.data ?? []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load products.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function startEdit(product: Product) {
    setEditingId(product.id);
    setFormState((prev) => ({
      ...prev,
      [product.id]: {
        name: product.name ?? "",
        price: String(product.price ?? ""),
        stock: product.stock === undefined ? "" : String(product.stock),
        description: product.description ?? "",
        unit: product.unit ?? "each",
        unitValue:
          product.unitValue === null || product.unitValue === undefined
            ? ""
            : String(product.unitValue),
        subcategoryId: product.subcategoryId ?? "",
      },
    }));
  }

  function updateForm(productId: string, key: string, value: string) {
    setFormState((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [key]: value,
      },
    }));
  }

  async function saveProduct(productId: string) {
    const form = formState[productId];
    if (!form?.name?.trim() || !form.price.trim() || !form.subcategoryId) {
      setMessage("Name, price, and subcategory are required.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const payload: Record<string, any> = {
        name: form.name.trim(),
        price: form.price.trim(),
        subcategoryId: form.subcategoryId,
        description: form.description.trim() || undefined,
        unit: form.unit || "each",
        unitValue: form.unitValue.trim() || undefined,
        stock: form.stock.trim() || undefined,
      };
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to update product.");
      }
      setEditingId(null);
      await loadProducts();
      setMessage("Product updated.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update product.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(productId: string) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to delete product.");
      }
      await loadProducts();
      setMessage("Product deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to delete product.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">
            Your products
          </h2>
          <p className="text-sm text-zinc-600">
            Edit pricing, stock, and details from one place.
          </p>
        </div>
        <button
          className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700"
          type="button"
          onClick={loadProducts}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {message ? (
        <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p>
      ) : null}

      {!products.length ? (
        <p className="mt-6 text-sm text-zinc-600">
          No products yet. Add items from the "Add product" page.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {products.map((product) => {
            const editing = editingId === product.id;
            const form = formState[product.id];
            return (
              <article
                key={product.id}
                className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
                    <img
                      alt={product.name}
                      className="h-12 w-12 object-contain"
                      src={
                        product.imagePath
                          ? `${imageBaseUrl}/products/image/${product.imagePath}`
                          : "/product-placeholder.svg"
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {subcategoryLookup[product.subcategoryId ?? ""] ??
                        "Unassigned"}{" "}
                      • {formatUnit(product)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-900">
                      Tk {formatPrice(product.price)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Stock {product.stock ?? 0}
                    </p>
                  </div>
                </div>

                {editing ? (
                  <div className="mt-4 space-y-3 text-xs text-zinc-700">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        Name
                        <input
                          className="rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-zinc-900 outline-none"
                          value={form?.name ?? ""}
                          onChange={(event) =>
                            updateForm(product.id, "name", event.target.value)
                          }
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        Price
                        <input
                          className="rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-zinc-900 outline-none"
                          value={form?.price ?? ""}
                          onChange={(event) =>
                            updateForm(product.id, "price", event.target.value)
                          }
                          inputMode="decimal"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        Stock
                        <input
                          className="rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-zinc-900 outline-none"
                          value={form?.stock ?? ""}
                          onChange={(event) =>
                            updateForm(product.id, "stock", event.target.value)
                          }
                          inputMode="numeric"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        Subcategory
                        <select
                          className="rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-zinc-900 outline-none"
                          value={form?.subcategoryId ?? ""}
                          onChange={(event) =>
                            updateForm(
                              product.id,
                              "subcategoryId",
                              event.target.value,
                            )
                          }
                        >
                          {categories.flatMap((category) =>
                            (category.subcategories ?? []).map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {category.name} - {sub.name}
                              </option>
                            )),
                          )}
                        </select>
                      </label>
                      <label className="flex flex-col gap-2">
                        Unit
                        <select
                          className="rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-zinc-900 outline-none"
                          value={form?.unit ?? "each"}
                          onChange={(event) =>
                            updateForm(product.id, "unit", event.target.value)
                          }
                        >
                          {Object.entries(unitLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-2">
                        Unit size
                        <input
                          className="rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-zinc-900 outline-none"
                          value={form?.unitValue ?? ""}
                          onChange={(event) =>
                            updateForm(
                              product.id,
                              "unitValue",
                              event.target.value,
                            )
                          }
                          inputMode="decimal"
                          disabled={form?.unit === "each"}
                        />
                      </label>
                    </div>
                    <label className="flex flex-col gap-2">
                      Description
                      <textarea
                        className="min-h-[90px] rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-zinc-900 outline-none"
                        value={form?.description ?? ""}
                        onChange={(event) =>
                          updateForm(
                            product.id,
                            "description",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
                        type="button"
                        onClick={() => saveProduct(product.id)}
                        disabled={loading}
                      >
                        Save changes
                      </button>
                      <button
                        className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700"
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-700"
                      type="button"
                      onClick={() => startEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600"
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
