export const dynamic = "force-static";

import Footer from "@/components/Footer";
import InfoCard from "@/components/InfoCard";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <main className="flex w-full flex-col gap-16 p-0">
        <Navbar />
        <HeroSection />
        <FeaturedSection />
        <ValueSection />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="grid items-center gap-10 md:grid-cols-2">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Fresh marketplace
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-emerald-950 sm:text-5xl">
          Toor-Taja connects local sellers with buyers who value fresh, honest
          goods.
        </h1>
        <p className="text-lg leading-8 text-emerald-900/70">
          Discover seasonal produce, pantry staples, and handmade essentials in
          one reliable marketplace. Built for guests today, ready for buyers and
          sellers tomorrow.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
            href="#categories"
          >
            Explore categories
          </a>
          <a
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white/70 px-6 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-400"
            href="#value"
          >
            Why Toor-Taja
          </a>
        </div>
      </div>
      <div className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Marketplace snapshot
          </p>
          <div className="grid gap-4">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
              <p className="text-xs font-semibold text-amber-700">
                Featured today
              </p>
              <p className="mt-2 text-lg font-semibold text-amber-950">
                Organic Veggie Box
              </p>
              <p className="text-sm text-amber-900/70">
                Curated by trusted neighborhood farms.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <p className="text-xs font-semibold text-emerald-700">
                Top sellers
              </p>
              <p className="mt-2 text-lg font-semibold text-emerald-950">
                Artisan Spice Collective
              </p>
              <p className="text-sm text-emerald-900/70">
                Small batch blends with transparent sourcing.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
              <p className="text-xs font-semibold text-sky-700">
                Service area
              </p>
              <p className="mt-2 text-lg font-semibold text-sky-950">
                Same-day pickup
              </p>
              <p className="text-sm text-sky-900/70">
                Schedule collection around your routine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedSection() {
  return (
    <section id="categories" className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-emerald-950 sm:text-3xl">
          Featured categories
        </h2>
        <p className="max-w-2xl text-emerald-900/70">
          Browse a curated mix of essentials and specialty goods from verified
          local sellers.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Fresh produce",
            detail: "Seasonal fruits, vegetables, and farm bundles.",
          },
          {
            title: "Pantry & staples",
            detail: "Grains, spices, and everyday kitchen essentials.",
          },
          {
            title: "Home & wellness",
            detail: "Handmade soaps, oils, and homecare favorites.",
          },
          {
            title: "Baked goods",
            detail: "Daily breads, pastries, and small-batch sweets.",
          },
          {
            title: "Dairy & artisan",
            detail: "Cheeses, yogurts, and farmer-made specialties.",
          },
          {
            title: "Ready meals",
            detail: "Chef-prepared meals for quick, healthy dining.",
          },
        ].map((item) => (
          <InfoCard
            key={item.title}
            title={item.title}
            description={item.detail}
          />
        ))}
      </div>
    </section>
  );
}

function ValueSection() {
  return (
    <section id="value" className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-emerald-950 sm:text-3xl">
          Why Toor-Taja
        </h2>
        <p className="max-w-2xl text-emerald-900/70">
          Designed to keep trust, transparency, and convenience at the center
          of every order.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Verified sellers",
            detail:
              "Every shop is reviewed for quality, safety, and honest sourcing.",
          },
          {
            title: "Flexible fulfillment",
            detail:
              "Pick up locally or schedule delivery windows that fit your day.",
          },
          {
            title: "Transparent pricing",
            detail:
              "Clear pricing with no surprise fees, backed by seller ratings.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur"
          >
            <h3 className="text-lg font-semibold text-emerald-950">
              {item.title}
            </h3>
            <p className="mt-3 text-sm text-emerald-900/70">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
