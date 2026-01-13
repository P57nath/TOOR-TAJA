"use client";

import { useState } from "react";

type Category = {
  id: string;
  name: string;
  subcategories?: Array<{ id: string; name: string }>;
};

type SellerProductFormProps = {
  categories: Category[];
};

export default function SellerProductForm({
  categories,
}: SellerProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [subcategoryId, setSubcategoryId] = useState(
    categories[0]?.subcategories?.[0]?.id ?? "",
  );
  const [unit, setUnit] = useState("each");
  const [unitValue, setUnitValue] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (!name.trim() || !price.trim() || !subcategoryId) {
      setMessage("Name, price, and subcategory are required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("price", price.trim());
      formData.set("subcategoryId", subcategoryId);
      formData.set("unit", unit);
      if (unitValue.trim()) {
        formData.set("unitValue", unitValue.trim());
      }
      if (stock.trim()) {
        formData.set("stock", stock.trim());
      }
      if (description.trim()) {
        formData.set("description", description.trim());
      }
      if (imageFile) {
        formData.set("image", imageFile);
      }

      const response = await fetch("/api/seller/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to create product.");
      }

      setName("");
      setPrice("");
      setStock("");
      setUnit("each");
      setUnitValue("");
      setDescription("");
      setImageFile(null);
      setMessage("Product created.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to create product.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Add product</h2>
          <p className="mt-2 text-sm text-zinc-900/70">
            Craft a clean listing with pricing, size, and category details.
          </p>
        </div>
        <span className="rounded-full border border-white/20 bg-white/30 px-3 py-1 text-xs font-semibold text-zinc-900/70">
          New listing
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-zinc-900/70">
          Product name
          <input
            className="rounded-2xl border border-white/20 bg-white/60 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-300"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g., Fresh spinach bundle"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-zinc-900/70">
          Price (Tk)
          <input
            className="rounded-2xl border border-white/20 bg-white/60 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-300"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            inputMode="decimal"
            placeholder="e.g., 120"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-zinc-900/70">
          Stock
          <input
            className="rounded-2xl border border-white/20 bg-white/60 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-300"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            inputMode="numeric"
            placeholder="e.g., 60"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-zinc-900/70">
          Unit
          <select
            className="rounded-2xl border border-white/20 bg-white/60 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-300"
            value={unit}
            onChange={(event) => {
              const nextUnit = event.target.value;
              setUnit(nextUnit);
              if (nextUnit === "each") {
                setUnitValue("");
              }
            }}
          >
            <option value="each">Each</option>
            <option value="kg">Kg</option>
            <option value="g">Gram</option>
            <option value="pcs">Pcs</option>
            <option value="ml">Ml</option>
            <option value="L">Liter</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-zinc-900/70">
          Unit size
          <input
            className="rounded-2xl border border-white/20 bg-white/60 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-300"
            value={unitValue}
            onChange={(event) => setUnitValue(event.target.value)}
            inputMode="decimal"
            placeholder={unit === "each" ? "Optional" : "e.g., 500"}
            disabled={unit === "each"}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-zinc-900/70">
          Category
          <select
            className="rounded-2xl border border-white/20 bg-white/60 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-300"
            value={categoryId}
            onChange={(event) => {
              const nextCategoryId = event.target.value;
              setCategoryId(nextCategoryId);
              const nextCategory = categories.find(
                (category) => category.id === nextCategoryId,
              );
              setSubcategoryId(nextCategory?.subcategories?.[0]?.id ?? "");
            }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-zinc-900/70">
          Subcategory
          <select
            className="rounded-2xl border border-white/20 bg-white/60 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-300"
            value={subcategoryId}
            onChange={(event) => setSubcategoryId(event.target.value)}
          >
            {(categories.find((category) => category.id === categoryId)
              ?.subcategories ?? []
            ).map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-2 text-sm text-zinc-900/70">
        Description
        <textarea
          className="min-h-[110px] rounded-2xl border border-white/20 bg-white/60 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-300"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Share storage tips, size, and sourcing details."
        />
      </label>

      <label className="mt-4 flex flex-col gap-2 text-sm text-zinc-900/70">
        Product image
        <input
          className="rounded-2xl border border-white/20 bg-white/60 px-4 py-2 text-sm text-zinc-900 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setImageFile(file);
          }}
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Create product"}
        </button>
        {message ? (
          <span className="text-sm font-semibold text-emerald-700">
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
