"use client";

import { useState } from "react";

type Category = {
  id: string;
  name: string;
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
  const [categoryId, setCategoryId] = useState(
    categories[0]?.id ?? "",
  );
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (!name.trim() || !price.trim() || !categoryId) {
      setMessage("Name, price, and category are required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("price", price.trim());
      formData.set("categoryId", categoryId);
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
      className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur"
    >
      <h2 className="text-xl font-semibold text-zinc-900">Add product</h2>
      <p className="mt-2 text-sm text-zinc-900/70">
        Upload a product and assign it to one of the admin categories.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-zinc-900/70">
          Product name
          <input
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-sky-400"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g., Fresh spinach bundle"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-zinc-900/70">
          Price (Tk)
          <input
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-sky-400"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            inputMode="decimal"
            placeholder="e.g., 120"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-zinc-900/70">
          Stock
          <input
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-sky-400"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            inputMode="numeric"
            placeholder="e.g., 60"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-zinc-900/70">
          Category
          <select
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-sky-400"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-2 text-sm text-zinc-900/70">
        Description
        <textarea
          className="min-h-[110px] rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-sky-400"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Share storage tips, size, and sourcing details."
        />
      </label>

      <label className="mt-4 flex flex-col gap-2 text-sm text-zinc-900/70">
        Product image
        <input
          className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-zinc-900 file:mr-4 file:rounded-full file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-900"
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
          className="rounded-full bg-sky-500 px-6 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-sky-400"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Create product"}
        </button>
        {message ? (
          <span className="text-sm font-semibold text-sky-200">
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
