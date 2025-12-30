export const dynamic = "force-static";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const highlights = [
  {
    title: "Neighborhood produce",
    detail: "Daily deliveries from farms, markets, and family growers.",
  },
  {
    title: "Transparent pricing",
    detail: "See item sources, pickup times, and delivery windows upfront.",
  },
  {
    title: "Flexible fulfillment",
    detail: "Pick up locally or book same-day delivery with live tracking.",
  },
];

const categories = [
  {
    title: "Fresh produce",
    detail: "Seasonal fruits, greens, and farm bundles.",
  },
  {
    title: "Pantry staples",
    detail: "Rice, lentils, spices, and everyday essentials.",
  },
  {
    title: "Dairy and artisan",
    detail: "Cheeses, yogurts, and small-batch specialties.",
  },
  {
    title: "Ready meals",
    detail: "Chef-prepared bowls and healthy weeknight kits.",
  },
  {
    title: "Bakery",
    detail: "Fresh bread, pastries, and hand-rolled treats.",
  },
  {
    title: "Home care",
    detail: "Natural soaps, oils, and home wellness goods.",
  },
];

const steps = [
  {
    step: "01",
    title: "Choose a neighborhood",
    detail: "Select your delivery zone to see local sellers instantly.",
  },
  {
    step: "02",
    title: "Build a basket",
    detail: "Mix groceries, pantry staples, and handmade favorites.",
  },
  {
    step: "03",
    title: "Pick up or deliver",
    detail: "Schedule pickup windows or same-day courier delivery.",
  },
];

const sellers = [
  {
    name: "Shobuj Farm Collective",
    description: "Organic vegetables with morning harvest alerts.",
  },
  {
    name: "Dhaka Dairy Co-op",
    description: "Fresh milk, yogurt, and ghee on subscription.",
  },
  {
    name: "Spice Route Studio",
    description: "Small-batch blends sourced from trusted growers.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <main className="flex w-full flex-col gap-16 p-0">
        <Navbar />
        <HeroSection />
        <HighlightsSection />
        <CategorySection />
        <StepsSection />
        <SellersSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="grid items-center gap-10 px-6 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16">
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
          Fresh marketplace
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-emerald-950 sm:text-5xl">
          Toor-Taja brings the local bazaar online with fresh, trusted groceries.
        </h1>
        <p className="text-lg leading-8 text-emerald-900/70">
          Shop neighborhood sellers, plan pickups, and enjoy same-day delivery
          from a curated community of growers, bakers, and artisans.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
            href="#categories"
          >
            Shop fresh picks
          </a>
          <a
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white/70 px-6 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-400"
            href="#how-it-works"
          >
            How it works
          </a>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-emerald-900/70">
          <span className="rounded-full border border-emerald-200 bg-white/70 px-4 py-2">
            90+ verified sellers
          </span>
          <span className="rounded-full border border-emerald-200 bg-white/70 px-4 py-2">
            Same-day pickup
          </span>
          <span className="rounded-full border border-emerald-200 bg-white/70 px-4 py-2">
            Cold-chain ready
          </span>
        </div>
      </div>
      <div className="rounded-3xl border border-emerald-100 bg-white/85 p-8 shadow-sm backdrop-blur">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Delivery today
            </p>
            <h2 className="text-2xl font-semibold text-emerald-950">
              Build a basket in under 10 minutes.
            </h2>
            <p className="text-sm text-emerald-900/70">
              Add produce, staples, and handmade goods from vetted stores.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
              <p className="text-xs font-semibold text-amber-700">Popular now</p>
              <p className="mt-2 text-lg font-semibold text-amber-950">
                Harvest Veggie Box
              </p>
              <p className="text-sm text-amber-900/70">
                Fresh greens + seasonal fruits for the week.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <p className="text-xs font-semibold text-emerald-700">Top rated</p>
              <p className="mt-2 text-lg font-semibold text-emerald-950">
                Artisan Spice Blend
              </p>
              <p className="text-sm text-emerald-900/70">
                Small batch, ground weekly, sealed fresh.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
            <p className="text-xs font-semibold text-sky-700">
              Delivery promise
            </p>
            <p className="mt-2 text-lg font-semibold text-sky-950">
              Track every stop
            </p>
            <p className="text-sm text-sky-900/70">
              Live courier updates from seller to doorstep.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HighlightsSection() {
  return (
    <section className="space-y-8 px-6 sm:px-10 lg:px-16">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-emerald-950 sm:text-3xl">
          Built for fresh, trusted grocery runs
        </h2>
        <p className="max-w-2xl text-emerald-900/70">
          From farm gate to your kitchen, Toor-Taja keeps quality and
          transparency at the center of every order.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
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

function CategorySection() {
  return (
    <section id="categories" className="space-y-8 px-6 sm:px-10 lg:px-16">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-emerald-950 sm:text-3xl">
            Shop across every aisle
          </h2>
          <p className="max-w-2xl text-emerald-900/70">
            A curated mix of essentials and specialty goods from verified local
            sellers.
          </p>
        </div>
        <span className="text-sm font-semibold text-emerald-700">
          Updated daily
        </span>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur"
          >
            <h3 className="text-lg font-semibold text-emerald-950">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-emerald-900/70">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section
      id="how-it-works"
      className="space-y-8 rounded-[32px] border border-emerald-100 bg-white/70 px-6 py-12 shadow-sm backdrop-blur sm:px-10 lg:mx-16"
    >
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-emerald-950 sm:text-3xl">
          How Toor-Taja works
        </h2>
        <p className="max-w-2xl text-emerald-900/70">
          Built for busy households and local sellers, with every step tracked
          from order to delivery.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((item) => (
          <article
            key={item.step}
            className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {item.step}
            </p>
            <h3 className="mt-3 text-lg font-semibold text-emerald-950">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-emerald-900/70">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SellersSection() {
  return (
    <section className="space-y-8 px-6 sm:px-10 lg:px-16">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-emerald-950 sm:text-3xl">
          Spotlight sellers
        </h2>
        <p className="max-w-2xl text-emerald-900/70">
          Meet the makers and growers delivering Toor-Taja quality every day.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {sellers.map((seller) => (
          <article
            key={seller.name}
            className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Verified seller
            </p>
            <h3 className="mt-3 text-lg font-semibold text-emerald-950">
              {seller.name}
            </h3>
            <p className="mt-2 text-sm text-emerald-900/70">
              {seller.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="px-6 pb-8 sm:px-10 lg:px-16">
      <div className="flex flex-col gap-6 rounded-3xl border border-emerald-100 bg-emerald-900 px-8 py-10 text-white shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            Ready to start
          </p>
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Join the freshest grocery marketplace in town.
          </h2>
          <p className="text-sm text-emerald-100/80">
            Create a buyer or seller account to unlock personalized baskets and
            partner tools.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-900"
            href="/register"
          >
            Create account
          </a>
          <a
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-100"
            href="/login"
          >
            Sign in
          </a>
        </div>
      </div>
    </section>
  );
}
