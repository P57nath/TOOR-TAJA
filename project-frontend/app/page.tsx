export const dynamic = "force-static";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

const sidebarItems = [
  { label: "Vegetables", icon: "??" },
  { label: "Fruits", icon: "??" },
  { label: "Meat", icon: "??" },
  { label: "Dairy", icon: "??" },
  { label: "Bakery", icon: "??" },
  { label: "Pantry", icon: "??" },
];

const featureCards = [
  {
    title: "+15,000 products",
    detail: "to shop from",
    accent: "text-rose-500",
  },
  {
    title: "Pay after",
    detail: "receiving products",
    accent: "text-emerald-600",
  },
  {
    title: "Delivery within",
    detail: "1 hour",
    accent: "text-amber-600",
  },
  {
    title: "Offers that",
    detail: "save money",
    accent: "text-sky-600",
  },
];

const collageImages = [
  { src: "/register-illustration.jpg", alt: "Fresh produce" },
  { src: "/register-illustration.jpg", alt: "Grocery aisle" },
  { src: "/register-illustration.jpg", alt: "Local seller" },
  { src: "/register-illustration.jpg", alt: "Delivery rider" },
  { src: "/register-illustration.jpg", alt: "Market haul" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#C5D89D] text-zinc-900">
      <div className="relative">
        <header className="flex items-center justify-between gap-4 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              aria-label="Open menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-900/10 bg-white/70 text-2xl"
              type="button"
            >
              ?
            </button>
            <div className="flex items-center gap-2 text-2xl font-semibold">
              <span className="text-2xl">??</span>
              <span className="font-semibold">ToorTaja</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <button
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2"
              type="button"
            >
              <span className="text-emerald-600">??</span>
              Dhaka
              <span className="text-xs">?</span>
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <button className="rounded-full bg-white/70 px-3 py-2" type="button">
                EN
              </button>
              <button className="rounded-full bg-white/70 px-3 py-2" type="button">
                ?????
              </button>
            </div>
            <Link
              className="rounded-full bg-rose-500 px-5 py-2 text-white"
              href="/login"
            >
              Login
            </Link>
          </div>
        </header>

        <main className="relative mx-auto flex w-full max-w-7xl gap-6 px-6 pb-16 sm:px-8">
          <aside className="hidden w-20 flex-col items-center gap-4 pt-6 sm:flex">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-zinc-900/10 bg-white/70 text-xs font-semibold text-zinc-900 shadow-sm transition hover:-translate-y-0.5"
                type="button"
              >
                <span className="text-lg">{item.icon}</span>
              </button>
            ))}
          </aside>

          <section className="flex-1">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6 pt-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold leading-tight text-zinc-900 sm:text-5xl">
                    Grocery delivered at your doorstep
                  </h1>
                  <p className="max-w-xl text-base text-zinc-800/70">
                    Shop from trusted local sellers, schedule quick delivery, and
                    track every order from basket to doorstep.
                  </p>
                </div>
                <div className="flex w-full max-w-xl items-center rounded-2xl border border-zinc-900/10 bg-white px-4 py-3 shadow-sm">
                  <input
                    className="flex-1 border-none bg-transparent text-sm outline-none"
                    placeholder="Search for products (eggs, milk, potato)"
                    type="search"
                  />
                  <span className="text-lg text-zinc-500">??</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-zinc-900/10 bg-white/70 px-4 py-2 text-xs font-semibold">
                    Fresh arrivals
                  </span>
                  <span className="rounded-full border border-zinc-900/10 bg-white/70 px-4 py-2 text-xs font-semibold">
                    Same-day delivery
                  </span>
                  <span className="rounded-full border border-zinc-900/10 bg-white/70 px-4 py-2 text-xs font-semibold">
                    Verified sellers
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {collageImages.map((item, index) => (
                  <div
                    key={`${item.alt}-${index}`}
                    className={`relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${
                      index === 0 ? "col-span-2" : ""
                    }`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 220px, 45vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-900/10 bg-white/80 px-5 py-4 text-sm shadow-sm"
                >
                  <span className="text-xl">?</span>
                  <span>
                    <span className={`font-semibold ${card.accent}`}>
                      {card.title}
                    </span>{" "}
                    {card.detail}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <aside className="hidden w-24 flex-col items-center gap-4 pt-6 lg:flex">
            <div className="rounded-3xl border border-zinc-900/10 bg-white/90 px-4 py-6 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                ??
              </div>
              <p className="mt-4 text-xs font-semibold uppercase text-zinc-700">
                0 items
              </p>
              <p className="text-lg font-semibold text-zinc-900">? 0</p>
              <button
                className="mt-4 w-full rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                type="button"
              >
                View cart
              </button>
            </div>
          </aside>
        </main>
      </div>
      <Footer />
    </div>
  );
}
