import Navbar from "@/components/Navbar";
import { sampleProducts } from "@/lib/sample-products";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = sampleProducts.find((item) => item.slug === params.slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
        <Navbar />
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12 sm:py-16">
          <h1 className="text-3xl font-semibold text-emerald-950">
            Product not found
          </h1>
          <p className="text-emerald-900/70">
            The product slug `{params.slug}` does not exist in the demo list.
          </p>
          <a className="text-sm font-semibold text-emerald-700" href="/products">
            Back to products
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12 sm:py-16">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Dynamic route
          </p>
          <h1 className="text-3xl font-semibold text-emerald-950 sm:text-4xl">
            {product.name}
          </h1>
          <p className="text-emerald-900/70">{product.description}</p>
        </header>

        <section className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur">
          <h2 className="text-lg font-semibold text-emerald-950">
            Demo details
          </h2>
          <p className="mt-3 text-sm text-emerald-900/70">
            This page is generated from the folder-based dynamic route:
            `app/products/[slug]/page.tsx`.
          </p>
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Current slug
            </p>
            <p className="mt-2 text-lg font-semibold text-emerald-950">
              {params.slug}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
