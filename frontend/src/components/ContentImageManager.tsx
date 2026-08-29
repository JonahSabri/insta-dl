"use client";

import { useMemo, useState } from "react";

export interface ContentImageItem {
  index: number;
  src: string;
  alt: string;
  caption: string;
}

function parseImages(html: string): ContentImageItem[] {
  if (typeof window === "undefined") return [];
  const doc = new DOMParser().parseFromString(html || "", "text/html");
  const imgs = Array.from(doc.querySelectorAll("img"));
  return imgs.map((img, index) => {
    const figure = img.closest("figure");
    const caption = figure?.querySelector("figcaption")?.textContent?.trim() || "";
    return {
      index,
      src: img.getAttribute("src") || "",
      alt: img.getAttribute("alt") || "",
      caption,
    };
  });
}

function applyImageEdits(html: string, edits: ContentImageItem[]): string {
  const doc = new DOMParser().parseFromString(html || "", "text/html");
  const imgs = Array.from(doc.querySelectorAll("img"));
  edits.forEach((edit) => {
    const img = imgs[edit.index];
    if (!img) return;
    img.setAttribute("alt", edit.alt);
    const figure = img.closest("figure");
    if (figure) {
      let cap = figure.querySelector("figcaption");
      if (edit.caption) {
        if (!cap) {
          cap = doc.createElement("figcaption");
          figure.appendChild(cap);
        }
        cap.textContent = edit.caption;
      } else if (cap) {
        cap.remove();
      }
    }
  });
  return doc.body.innerHTML;
}

interface Props {
  html: string;
  onChange: (html: string) => void;
}

export default function ContentImageManager({ html, onChange }: Props) {
  const initial = useMemo(() => parseImages(html), [html]);
  const [edits, setEdits] = useState<ContentImageItem[] | null>(null);
  const items = edits ?? initial;

  if (!items.length) {
    return (
      <p className="text-[11px] text-slate-600">
        No inline images yet. Insert images in the editor (Alt required), then manage alts here.
      </p>
    );
  }

  function updateItem(index: number, patch: Partial<ContentImageItem>) {
    const next = items.map((it) => (it.index === index ? { ...it, ...patch } : it));
    setEdits(next);
  }

  function apply() {
    onChange(applyImageEdits(html, items));
    setEdits(null);
  }

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-300">
          Images in article ({items.length}) — edit Alt / caption
        </p>
        <button type="button" className="btn-secondary text-xs py-1 px-2" onClick={apply}>
          Apply alt changes
        </button>
      </div>
      <div className="space-y-3 max-h-72 overflow-y-auto">
        {items.map((img) => (
          <div key={img.index} className="flex gap-3 rounded-lg border border-white/5 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt || `Image ${img.index + 1}`}
              className="h-16 w-16 shrink-0 rounded object-cover border border-white/10"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[10px] text-slate-600 truncate font-mono" dir="ltr">
                #{img.index + 1} · {img.src}
              </p>
              <input
                className="input-field text-xs w-full"
                placeholder="Alt text (required for SEO)"
                value={img.alt}
                onChange={(e) => updateItem(img.index, { alt: e.target.value })}
              />
              <input
                className="input-field text-xs w-full"
                placeholder="Caption (optional)"
                value={img.caption}
                onChange={(e) => updateItem(img.index, { caption: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
