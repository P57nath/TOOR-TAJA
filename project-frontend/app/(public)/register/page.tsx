export const dynamic = "force-static";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-sky-50 text-zinc-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 sm:py-20">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Join the marketplace
          </p>
          <h1 className="text-3xl font-semibold text-emerald-950 sm:text-4xl">
            Create your Toor-Taja account
          </h1>
          <p className="max-w-2xl text-emerald-900/70">
            Register to save favorite sellers, manage deliveries, and unlock
            personalized offers. Authentication will be added later.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <form className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="text-sm font-semibold text-emerald-900"
                    htmlFor="register-first-name"
                  >
                    First name
                  </label>
                  <input
                    id="register-first-name"
                    name="firstName"
                    type="text"
                    placeholder="Amina"
                    className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-semibold text-emerald-900"
                    htmlFor="register-last-name"
                  >
                    Last name
                  </label>
                  <input
                    id="register-last-name"
                    name="lastName"
                    type="text"
                    placeholder="Rahman"
                    className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label
                  className="text-sm font-semibold text-emerald-900"
                  htmlFor="register-email"
                >
                  Email address
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label
                  className="text-sm font-semibold text-emerald-900"
                  htmlFor="register-phone"
                >
                  Phone number
                </label>
                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label
                  className="text-sm font-semibold text-emerald-900"
                  htmlFor="register-password"
                >
                  Password
                </label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="Create a secure password"
                  className="mt-2 w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 shadow-sm focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <button
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                type="button"
              >
                Create account
              </button>
              <p className="text-xs text-emerald-900/60">
                By creating an account you agree to future Toor-Taja terms and
                privacy policies.
              </p>
            </div>
          </form>

          <aside className="space-y-6 rounded-3xl border border-amber-100 bg-white/70 p-8 shadow-sm backdrop-blur">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-950">
                Already have an account?
              </h2>
              <p className="text-sm text-emerald-900/70">
                Return to sign in and continue shopping from your saved lists.
              </p>
              <a
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white/70 px-6 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-400"
                href="/login"
              >
                Sign in
              </a>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 text-sm text-emerald-900/70">
              <p className="font-semibold text-emerald-950">
                Marketplace benefits
              </p>
              <p className="mt-2">
                Early access to new sellers, flexible delivery windows, and
                curated weekly picks.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
