"use client";

import { useEffect, useState } from "react";

type Story = {
  id: string;
  title?: string;
  imagePath: string;
  isApproved: boolean;
  sellerProfile?: { storeName?: string };
};

type AdminStoriesClientProps = {
  token: string;
  apiBaseUrl: string;
};

export default function AdminStoriesClient({
  token,
  apiBaseUrl,
}: AdminStoriesClientProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadStories() {
      setMessage("");
      const response = await fetch(
        `${apiBaseUrl}/admin/stories?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        setMessage("Unable to load stories.");
        return;
      }
      const data = (await response.json()) as Story[];
      setStories(data);
    }
    loadStories();
  }, [apiBaseUrl, status, token]);

  async function handleApprove(storyId: string) {
    const response = await fetch(`${apiBaseUrl}/admin/stories/${storyId}/approve`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      setMessage("Failed to approve story.");
      return;
    }
    setStories((prev) => prev.filter((story) => story.id !== storyId));
  }

  return (
    <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Story approvals
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Review seller stories before they appear to buyers.
          </p>
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          {["pending", "approved"].map((item) => (
            <button
              key={item}
              className={`rounded-full border px-4 py-2 transition ${
                status === item
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-indigo-100 text-slate-600 hover:border-indigo-300"
              }`}
              type="button"
              onClick={() => setStatus(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {message ? <p className="mt-4 text-sm text-rose-600">{message}</p> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {stories.length ? (
          stories.map((story) => (
            <article
              key={story.id}
              className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm"
            >
              <div className="aspect-[3/5] bg-indigo-50">
                <img
                  alt={story.title ?? "Story"}
                  className="h-full w-full object-cover"
                  src={`${apiBaseUrl}/stories/image/${story.imagePath}`}
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs font-semibold uppercase text-indigo-600">
                  {story.sellerProfile?.storeName ?? "Seller"}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {story.title ?? "Untitled story"}
                </p>
                {story.isApproved ? (
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Approved
                  </span>
                ) : (
                  <button
                    className="inline-flex rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                    type="button"
                    onClick={() => handleApprove(story.id)}
                  >
                    Approve
                  </button>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-6 text-sm text-indigo-700">
            No stories in this view.
          </div>
        )}
      </div>
    </section>
  );
}
