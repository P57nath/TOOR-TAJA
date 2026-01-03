"use client";

import { useEffect, useMemo, useState } from "react";

type Story = {
  id: string;
  title?: string;
  imagePath: string;
  sellerProfile?: { storeName?: string };
};

type BuyerStoriesProps = {
  stories: Story[];
  apiBaseUrl: string;
  durationMs?: number;
};

export default function BuyerStories({
  stories,
  apiBaseUrl,
  durationMs = 8000,
}: BuyerStoriesProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [progress, setProgress] = useState(0);

  const hasStories = stories.length > 0;

  useEffect(() => {
    if (!activeStory) return;
    setProgress(0);

    const start = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const next = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(next);
    }, 50);

    const timeout = window.setTimeout(() => {
      setActiveStory(null);
    }, durationMs);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(timeout);
    };
  }, [activeStory, durationMs]);

  const storyImageUrl = useMemo(() => {
    if (!activeStory) return "";
    return `${apiBaseUrl}/stories/image/${activeStory.imagePath}`;
  }, [activeStory, apiBaseUrl]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-amber-950">
          Marketplace stories
        </h2>
        <span className="text-sm font-semibold text-amber-700">View more</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {hasStories ? (
          stories.map((story) => (
            <button
              key={story.id}
              className="relative h-48 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm"
              type="button"
              onClick={() => setActiveStory(story)}
            >
              <img
                alt={story.title ?? "Story"}
                className="h-full w-full object-cover"
                src={`${apiBaseUrl}/stories/image/${story.imagePath}`}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2 text-[10px] text-white">
                <p className="font-semibold">
                  {story.sellerProfile?.storeName ?? "Seller"}
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-2xl border border-amber-100 bg-white px-4 py-6 text-sm text-amber-900/70">
            No stories yet. Check back soon.
          </div>
        )}
      </div>

      {activeStory ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="h-1.5 w-full bg-emerald-100">
              <div
                className="h-full bg-emerald-500 transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <button
              className="absolute right-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold"
              type="button"
              onClick={() => setActiveStory(null)}
            >
              Close
            </button>
            <img
              alt={activeStory.title ?? "Story"}
              className="h-[70vh] w-full object-cover"
              src={storyImageUrl}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 text-xs text-white">
              <p className="font-semibold">
                {activeStory.sellerProfile?.storeName ?? "Seller"}
              </p>
              {activeStory.title ? <p>{activeStory.title}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
