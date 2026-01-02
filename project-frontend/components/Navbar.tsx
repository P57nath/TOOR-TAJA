"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type NavbarProps = {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
  showMenuButton?: boolean;
};

const divisions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export default function Navbar({
  onMenuToggle,
  isMenuOpen = false,
  showMenuButton = true,
}: NavbarProps) {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState("Dhaka");
  const [isDetecting, setIsDetecting] = useState(false);

  function handleDetectLocation() {
    if (!("geolocation" in navigator)) {
      setLocationLabel("Location unavailable");
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationLabel("Current location");
        setIsDetecting(false);
        setIsLocationOpen(false);
      },
      () => {
        setLocationLabel("Location denied");
        setIsDetecting(false);
      },
      { timeout: 8000 },
    );
  }

  return (
    <div className="w-full">
      <nav className="relative flex w-full flex-wrap items-center justify-between gap-4 border-b border-zinc-900/10 bg-[#C5D89D] px-6 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          {showMenuButton ? (
            <button
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-900/10 bg-white/70"
              type="button"
              onClick={onMenuToggle}
            >
              <Image
                src={isMenuOpen ? "/cross.png" : "/left-side-nav.png"}
                alt={isMenuOpen ? "Close navigation" : "Open navigation"}
                width={22}
                height={22}
              />
            </button>
          ) : null}
          <Link
            className="flex items-center gap-2 text-2xl font-semibold text-zinc-900"
            href="/"
          >
            <Image
              src="/toortaja-logo.png"
              width={36}
              height={36}
              alt="Toor-Taja logo"
              className="h-9 w-9 object-contain"
            />
            <span>ToorTaja</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 text-sm font-semibold">
          <div className="relative">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/70 px-4 py-2 text-zinc-900 shadow-sm"
              type="button"
              onClick={() => setIsLocationOpen((open) => !open)}
            >
              <span className="text-emerald-600" aria-hidden>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s-6-5.5-6-10a6 6 0 1 1 12 0c0 4.5-6 10-6 10z" />
                  <circle cx="12" cy="11" r="2" />
                </svg>
              </span>
              {locationLabel}
              <span className="text-emerald-600" aria-hidden>
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
            {isLocationOpen ? (
              <div className="absolute right-0 top-12 z-10 w-56 rounded-2xl border border-emerald-100 bg-white p-3 shadow-lg">
                <button
                  className="mb-2 flex w-full items-center justify-center rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-400"
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetecting}
                >
                  {isDetecting ? "Detecting..." : "Use current location"}
                </button>
                <div className="grid gap-2 text-xs">
                  {divisions.map((division) => (
                    <button
                      key={division}
                      className="rounded-xl border border-emerald-100 px-3 py-2 text-left text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50"
                      type="button"
                      onClick={() => {
                        setLocationLabel(division);
                        setIsLocationOpen(false);
                      }}
                    >
                      {division}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <button
            className="hidden items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-xs font-semibold sm:inline-flex"
            type="button"
          >
            EN / বাংলা
          </button>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-[#D2042D] px-5 py-2 text-white shadow-sm transition hover:bg-[#bb0328]"
            href="/login"
          >
            Login/Register
          </Link>
        </div>
      </nav>
    </div>
  );
}
