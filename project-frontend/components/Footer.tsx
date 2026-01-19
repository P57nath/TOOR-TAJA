export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-white/90">
      <div className="w-full px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[2fr_2fr_2fr_3fr]">
          <div className="space-y-3 text-sm text-emerald-900/70">
            <p className="text-base font-semibold text-emerald-950">
              About Toor-Taja
            </p>
            <p>Our story</p>
            <p>Team</p>
            <p>Privacy policy</p>
            <p>Terms of use</p>
            <p className="pt-2 text-base font-semibold text-emerald-950">
              Payment methods
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-emerald-700">
              <span className="rounded-full border border-emerald-200 px-3 py-1">
                VISA
              </span>
              <span className="rounded-full border border-emerald-200 px-3 py-1">
                MasterCard
              </span>
              <span className="rounded-full border border-emerald-200 px-3 py-1">
                AmEx
              </span>
              <span className="rounded-full border border-emerald-200 px-3 py-1">
                bKash
              </span>
            </div>
          </div>

          <div className="space-y-3 text-sm text-emerald-900/70">
            <p className="text-base font-semibold text-emerald-950">
              Customer service
            </p>
            <p>Contact us</p>
            <p>FAQ</p>
            <p>Returns</p>
            <p>Delivery info</p>
          </div>

          <div className="space-y-3 text-sm text-emerald-900/70">
            <p className="text-base font-semibold text-emerald-950">
              For business
            </p>
            <p>Corporate</p>
            <p>Bulk ordering</p>
            <p>Supplier hub</p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center rounded-full border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-900/70 shadow-sm">
              <span className="mr-3 text-emerald-700">+88</span>
              <input
                className="flex-1 border-none bg-transparent text-sm text-emerald-950 outline-none"
                placeholder="Enter phone to get the app"
                type="tel"
              />
              <button
                className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
                type="button"
              >
                Get app
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-emerald-900 px-4 py-2 text-xs font-semibold text-white">
                Google Play
              </span>
              <span className="rounded-lg bg-emerald-900 px-4 py-2 text-xs font-semibold text-white">
                App Store
              </span>
            </div>

            <div className="text-sm text-emerald-900/70">
              <p className="text-lg font-semibold text-emerald-950">16710</p>
              <p className="text-emerald-800">support@toortaja.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-100 px-6 py-4 text-sm text-emerald-900/70 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>© 2025 Toor-Taja Limited</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold">
              Facebook
            </span>
            <span className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold">
              X
            </span>
            <span className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold">
              Instagram
            </span>
            <span className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold">
              English (EN)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
