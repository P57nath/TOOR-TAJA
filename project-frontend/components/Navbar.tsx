"use client";

import Image from "next/image";
import Link from "next/link";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

type NavbarProps = {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
  showMenuButton?: boolean;
  showSearch?: boolean;
  showAuthButton?: boolean;
  showUserActions?: boolean;
  searchPlaceholder?: string;
  logoRefreshOnClick?: boolean;
  notificationRole?: "buyer" | "seller" | "admin";
  notificationUserId?: string;
  profileLinks?: Array<{ label: string; href: string }>;
  logoHref?: string;
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
  showSearch = false,
  showAuthButton = true,
  showUserActions = false,
  searchPlaceholder = "Search for products...",
  logoRefreshOnClick = false,
  notificationRole,
  notificationUserId,
  profileLinks,
  logoHref = "/",
}: NavbarProps) {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState("Dhaka");
  const [isDetecting, setIsDetecting] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      id?: string;
      title: string;
      body: string;
      createdAt: string;
      isRead?: boolean;
    }>
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!notificationRole) return;
    if (
      (notificationRole === "buyer" || notificationRole === "seller") &&
      !notificationUserId
    ) {
      return;
    }
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!key || !cluster) return;

    const pusher = new Pusher(key, {
      cluster,
      authEndpoint: "/api/realtime/auth",
    });

    const channelName =
      notificationRole === "admin"
        ? "private-admin"
        : `private-${notificationRole}-${notificationUserId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("notification", (data: any) => {
      const payload = {
        id: data?.id ? String(data.id) : undefined,
        title: String(data?.title ?? "Notification"),
        body: String(data?.body ?? ""),
        createdAt: String(data?.createdAt ?? new Date().toISOString()),
      };
      setNotifications((prev) => [payload, ...prev].slice(0, 20));
      setUnreadCount((count) => count + 1);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [notificationRole, notificationUserId]);

  useEffect(() => {
    if (!notificationRole) return;
    if (
      (notificationRole === "buyer" || notificationRole === "seller") &&
      !notificationUserId
    ) {
      return;
    }

    async function loadHistory() {
      try {
        const response = await fetch("/api/notifications?limit=20", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        const list = Array.isArray(data) ? data : data?.data;
        if (!Array.isArray(list)) return;
        const mapped = list.map((item: any) => ({
          id: item.id ? String(item.id) : undefined,
          title: String(item.title ?? "Notification"),
          body: String(item.body ?? ""),
          createdAt: String(item.createdAt ?? new Date().toISOString()),
          isRead: Boolean(item.isRead),
        }));
        setNotifications(mapped);
        const unread = mapped.filter((note) => !note.isRead).length;
        setUnreadCount(unread);
      } catch {
        return;
      }
    }

    void loadHistory();
  }, [notificationRole, notificationUserId]);

  useEffect(() => {
    if (isNotificationsOpen) {
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((note) => ({ ...note, isRead: true })),
      );
      void fetch("/api/notifications/read", { method: "POST" });
    }
  }, [isNotificationsOpen]);

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
      <nav className="relative flex w-full flex-wrap items-center gap-4 bg-[#C5D89D] px-6 py-3 shadow-[0_1px_0_rgba(0,0,0,0.05)] sm:px-8">
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
          {logoRefreshOnClick ? (
            <button
              className="flex items-center gap-2 text-2xl font-semibold text-zinc-900"
              type="button"
              onClick={() => window.location.reload()}
            >
              <Image
                src="/toortaja-logo.png"
                width={36}
                height={36}
                alt="Toor-Taja logo"
                className="h-9 w-9 object-contain"
              />
              <span>ToorTaja</span>
            </button>
          ) : (
            <Link
              className="flex items-center gap-2 text-2xl font-semibold text-zinc-900"
              href={logoHref}
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
          )}
        </div>

        {showSearch ? (
          <div className="hidden w-full max-w-md flex-1 items-center md:flex">
            <div className="flex w-full items-center rounded-2xl border border-zinc-900/10 bg-white/70 px-4 py-2 shadow-sm">
              <input
                className="w-full border-none bg-transparent text-sm outline-none"
                placeholder={searchPlaceholder}
                type="search"
              />
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
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </span>
            </div>
          </div>
        ) : null}

        <div className="ml-auto flex items-center gap-3 text-sm font-semibold">
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
          {showUserActions ? (
            <div className="relative hidden items-center gap-2 sm:flex">
              <div className="relative">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-900/10 bg-white/70"
                  type="button"
                  aria-label="Notifications"
                  onClick={() =>
                    setIsNotificationsOpen((open) => !open)
                  }
                >
                  <svg
                    className="h-4 w-4 text-emerald-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
                    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                  </svg>
                  {unreadCount > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </button>
                {isNotificationsOpen ? (
                  <div className="absolute right-0 top-12 z-10 w-72 rounded-2xl border border-emerald-100 bg-white p-3 text-xs shadow-lg">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Notifications
                    </p>
                    <div className="max-h-64 space-y-2 overflow-y-auto">
                      {notifications.length ? (
                        notifications.map((note, index) => (
                          <div
                            key={`${note.createdAt}-${index}`}
                            className="rounded-xl border border-emerald-50 bg-emerald-50/40 px-3 py-2"
                          >
                            <p className="text-xs font-semibold text-emerald-900">
                              {note.title}
                            </p>
                            <p className="mt-1 text-[11px] text-emerald-900/70">
                              {note.body}
                            </p>
                            <p className="mt-1 text-[10px] text-emerald-700/70">
                              {new Date(note.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-emerald-700/70">
                          No notifications yet.
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-900/10 bg-white/70"
                type="button"
                aria-label="Profile"
                onClick={() => setIsProfileOpen((open) => !open)}
              >
                <svg
                  className="h-4 w-4 text-emerald-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
              </button>
              {isProfileOpen ? (
                <div className="absolute right-0 top-12 z-10 w-56 rounded-2xl border border-emerald-100 bg-white p-3 text-xs shadow-lg">
                  {(profileLinks ?? [
                    { label: "Your profile", href: "/buyer/profile" },
                    { label: "Your orders", href: "/buyer/orders" },
                    { label: "Payment history", href: "/buyer/payments/history" },
                    { label: "Payment methods", href: "/buyer/payments/methods" },
                    { label: "Change password", href: "/forgot-password" },
                  ]).map((item) => (
                    <Link
                      key={item.label}
                      className="block rounded-xl px-3 py-2 font-semibold text-emerald-900 transition hover:bg-emerald-50"
                      href={item.href}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    className="mt-2 block w-full rounded-xl border border-emerald-100 px-3 py-2 font-semibold text-rose-600 transition hover:bg-rose-50"
                    href="/login"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Logout
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}
          {showAuthButton ? (
            <Link
              className="inline-flex items-center justify-center rounded-full bg-[#D2042D] px-5 py-2 text-white shadow-sm transition hover:bg-[#bb0328]"
              href="/login"
            >
              Login/Register
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
