"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navigation = ["Product", "Features", "Pricing", "Company", "Blog"];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <nav className="relative flex w-full flex-wrap items-center justify-between gap-4 border border-emerald-100 bg-white/80 px-6 py-4 shadow-sm backdrop-blur sm:px-8">
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle Menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-900 shadow-sm lg:hidden"
            type="button"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="text-xl">{isOpen ? "×" : "≡"}</span>
          </button>
          <Link className="flex items-center gap-2 text-2xl font-semibold text-emerald-950" href="/">
            <Image
              src="/toortaja-logo.png"
              width={32}
              height={32}
              alt="Toor-Taja logo"
              className="h-8 w-8 object-contain"
            />
            <span>ToorTaja</span>
          </Link>
        </div>

        <div className="hidden items-center gap-3 text-sm font-semibold lg:flex">
          {navigation.map((item) => (
            <Link
              key={item}
              className="rounded-full px-4 py-2 text-emerald-900/80 transition hover:bg-emerald-50 hover:text-emerald-700"
              href="/"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white/70 px-5 py-2 text-emerald-900 shadow-sm transition hover:border-emerald-400"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 py-2 text-white shadow-sm transition hover:bg-emerald-600"
            href="/register"
          >
            Register
          </Link>
        </div>

        {isOpen ? (
          <div className="flex w-full flex-col gap-3 lg:hidden">
            {navigation.map((item) => (
              <Link
                key={item}
                className="rounded-2xl border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-emerald-900/80 shadow-sm"
                href="/"
              >
                {item}
              </Link>
            ))}
          </div>
        ) : null}
      </nav>
    </div>
  );
}
