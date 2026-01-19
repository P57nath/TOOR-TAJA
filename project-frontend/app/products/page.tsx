import InfoCard from "@/components/InfoCard";
import Navbar from "@/components/Navbar";
import { sampleProducts } from "@/lib/sample-products";

export const dynamic = "force-static";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:py-16">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Dynamic routing
          </p>
          <h1 className="text-3xl font-semibold text-emerald-950 sm:text-4xl">
            Featured products
          </h1>
          <p className="max-w-2xl text-emerald-900/70">
            Each card links to a dynamic route: `/products/[slug]`.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {sampleProducts.map((product) => (
            <InfoCard
              key={product.slug}
              title={product.name}
              description={product.description}
              href={`/products/${product.slug}`}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
