"use client";

import { useState } from "react";

type SellerStoriesClientProps = {
  token: string;
  apiBaseUrl: string;
};

type UploadStatus = "idle" | "loading" | "success" | "error";

export default function SellerStoriesClient({
  token,
  apiBaseUrl,
}: SellerStoriesClientProps) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setMessage("Please select an image to upload.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (title.trim()) {
        formData.append("title", title.trim());
      }

      const response = await fetch(`${apiBaseUrl}/seller/stories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Story upload failed.");
      }

      setStatus("success");
      setMessage("Story submitted. Waiting for admin approval.");
      setTitle("");
      setFile(null);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur">
      <h2 className="text-xl font-semibold text-white">Post a story</h2>
      <p className="mt-2 text-sm text-white/70">
        Upload a vertical image for the buyer story strip. Admin approval
        required before it appears.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300"
            htmlFor="story-title"
          >
            Title (optional)
          </label>
          <input
            id="story-title"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            placeholder="Eid Special Discounts"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label
            className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300"
            htmlFor="story-image"
          >
            Story image
          </label>
          <input
            id="story-image"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </div>

        {message ? (
          <p
            className={`text-sm ${
              status === "success" ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {message}
          </p>
        ) : null}

        <button
          className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Uploading..." : "Submit story"}
        </button>
      </form>
    </section>
  );
}
