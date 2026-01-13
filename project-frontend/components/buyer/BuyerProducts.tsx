"use client";

import { useMemo, useState } from "react";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  price: number | string;
  categoryId?: string | null;
  category?: Category | null;
  description?: string | null;
  imagePath?: string | null;
  unit?: string | null;
  unitValue?: number | string | null;
};

type ProductSection = {
  title: string;
  products: Product[];
};

type BuyerProductsProps = {
  products: Product[];
  categories?: Category[];
  imageBaseUrl: string;
};

function extractUnitLabel(product: Product) {
  if (product.unit) {
    const unit = product.unit;
    const value =
      product.unitValue === null || product.unitValue === undefined
        ? ""
        : String(product.unitValue);
    if (unit === "each" && !value) {
      return "each";
    }
    if (!value) {
      return unit === "L" ? "1 L" : `1 ${unit}`;
    }
    const normalized = value.replace(",", ".");
    return `${normalized} ${unit === "L" ? "L" : unit}`;
  }

  const text = `${product.name} ${product.description ?? ""}`.toLowerCase();
  const match = text.match(
    /(\d+(?:[.,]\d+)?)\s?(ml|l|kg|g|gm|gram|grams|pcs|pc|piece|pieces)\b/,
  );
  if (match) {
    const quantity = match[1].replace(",", ".");
    const rawUnit = match[2];
    const unitMap: Record<string, string> = {
      ml: "ml",
      l: "L",
      kg: "kg",
      g: "g",
      gm: "g",
      gram: "g",
      grams: "g",
      pcs: "pcs",
      pc: "pcs",
      piece: "pcs",
      pieces: "pcs",
    };
    const unit = unitMap[rawUnit] ?? rawUnit;
    return `${quantity} ${unit}`;
  }
  if (text.includes("milk") || text.includes("dairy")) return "1 L";
  if (text.includes("water") || text.includes("drink")) return "500 ml";
  if (text.includes("vegetable") || text.includes("fruit")) return "1 kg";
  return "each";
}

function formatPrice(value: number | string) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numeric)) return "0";
  return Math.round(numeric).toString();
}

export default function BuyerProducts({
  products,
  categories = [],
  imageBaseUrl,
}: BuyerProductsProps) {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const sections = useMemo<ProductSection[]>(() => {
    if (!products.length) return [];

    const sortedByRating = [...products].sort((a, b) => {
      const ar = Number((a as any).ratingAverage ?? 0);
      const br = Number((b as any).ratingAverage ?? 0);
      const ac = Number((a as any).ratingCount ?? 0);
      const bc = Number((b as any).ratingCount ?? 0);
      return br - ar || bc - ac;
    });

    const sortedByPrice = [...products].sort((a, b) => {
      const ap = Number(a.price);
      const bp = Number(b.price);
      return ap - bp;
    });

    const used = new Set<string>();
    const recommended = sortedByRating.filter((item) => {
      if (used.size >= 8) return false;
      used.add(item.id);
      return true;
    });

    const flashSales = sortedByPrice.filter((item) => {
      if (used.has(item.id)) return false;
      if (used.size >= 16) return false;
      used.add(item.id);
      return true;
    });

    const grouped = products.reduce<
      Record<string, { label: string; items: Product[] }>
    >((acc, item) => {
      const key = item.category?.id ?? item.categoryId ?? "uncategorized";
      const label = item.category?.name ?? "More";
      if (!acc[key]) {
        acc[key] = { label, items: [] };
      }
      acc[key].items.push(item);
      return acc;
    }, {});

    const orderedCategories = categories.length
      ? categories
      : Object.entries(grouped).map(([id, value]) => ({
          id,
          name: value.label,
        }));

    const categorySections = orderedCategories
      .map((category) => {
        const bucket = grouped[category.id];
        return bucket
          ? { title: category.name, products: bucket.items.slice(0, 8) }
          : null;
      })
      .filter(
        (section): section is ProductSection =>
          Boolean(section && section.products.length),
      )
      .slice(0, 4);

    return [
      { title: "Recommended for you", products: recommended },
      { title: "Flash sales", products: flashSales },
      ...categorySections,
    ];
  }, [products, categories]);

  async function handleAddToCart(productId: string) {
    setAddingId(productId);
    setMessage("");
    try {
      const response = await fetch("/api/buyer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Unable to add to cart.");
      }
      setMessage("Added to cart.");
      window.dispatchEvent(new CustomEvent("cart:updated"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Add to cart failed.");
    } finally {
      setAddingId(null);
    }
  }

  if (!sections.length) {
    return (
      <section className="rounded-3xl border border-amber-100 bg-white p-6 text-sm text-amber-900/70 shadow-sm">
        No products found yet. Add products from a seller account to populate
        this section.
      </section>
    );
  }

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.title} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-amber-950">
              {section.title}
            </h2>
            <span className="text-sm font-semibold text-amber-700">
              View more -&gt;
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {section.products.map((product) => (
              <article
                key={product.id}
                className="rounded-3xl border border-amber-100 bg-white p-4 shadow-sm"
              >
                <button
                  className="flex w-full items-center justify-center rounded-2xl bg-amber-50 px-4 py-6 transition hover:shadow-md"
                  type="button"
                  onClick={() => setActiveProduct(product)}
                  aria-label={`View ${product.name}`}
                >
                  <img
                    alt={product.name}
                    className="h-24 w-24 object-contain"
                    src={
                      product.imagePath
                        ? `${imageBaseUrl}/products/image/${product.imagePath}`
                        : "/product-placeholder.svg"
                    }
                  />
                </button>
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-semibold text-amber-950">
                    {product.name}
                  </h3>
                  <p className="text-xs text-amber-900/60">
                    {extractUnitLabel(product)}
                  </p>
                  <p className="text-base font-semibold text-amber-950">
                    Tk {formatPrice(product.price)}
                  </p>
                </div>
                <button
                  className="mt-4 w-full rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-amber-800 transition hover:border-amber-400 hover:text-amber-900"
                  type="button"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingId === product.id}
                >
                  {addingId === product.id ? "Adding..." : "Add to bag"}
                </button>
              </article>
            ))}
          </div>
        </section>
      ))}
      {message ? (
        <p className="text-sm font-semibold text-emerald-700">{message}</p>
      ) : null}
      {activeProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-3xl border border-amber-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-950">
                  {activeProduct.name}
                </h3>
                <p className="text-sm text-amber-900/60">
                  {extractUnitLabel(activeProduct)}
                </p>
              </div>
              <button
                className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800"
                type="button"
                onClick={() => setActiveProduct(null)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <div className="flex w-full items-center justify-center rounded-3xl bg-amber-50 p-6 sm:w-1/2">
                <img
                  alt={activeProduct.name}
                  className="h-44 w-44 object-contain"
                  src={
                    activeProduct.imagePath
                      ? `${imageBaseUrl}/products/image/${activeProduct.imagePath}`
                      : "/product-placeholder.svg"
                  }
                />
              </div>
              <div className="flex w-full flex-col justify-between gap-4 sm:w-1/2">
                <p className="text-sm text-amber-900/70">
                  {activeProduct.description || "No description provided yet."}
                </p>
                <div>
                  <p className="text-sm text-amber-900/60">Price</p>
                  <p className="text-xl font-semibold text-amber-950">
                    Tk {formatPrice(activeProduct.price)}
                  </p>
                </div>
                <button
                  className="w-full rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-amber-800 transition hover:border-amber-400 hover:text-amber-900"
                  type="button"
                  onClick={() => {
                    setActiveProduct(null);
                    handleAddToCart(activeProduct.id);
                  }}
                  disabled={addingId === activeProduct.id}
                >
                  {addingId === activeProduct.id ? "Adding..." : "Add to bag"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
