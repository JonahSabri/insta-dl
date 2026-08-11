"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  uploadImage?: (file: File) => Promise<string>;
  dir?: "ltr" | "rtl";
}

const FONTS = [
  { label: "Default", value: "inherit" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
];

const SIZES = [
  { label: "Small", value: "2" },
  { label: "Normal", value: "3" },
  { label: "Medium", value: "4" },
  { label: "Large", value: "5" },
  { label: "X-Large", value: "6" },
  { label: "Huge", value: "7" },
];

function escapeAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function Btn({
  title,
  onClick,
  children,
  active,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white",
        active && "bg-white/10 text-white"
      )}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your article…",
  uploadImage,
  dir = "ltr",
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imgOpen, setImgOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [imgTitle, setImgTitle] = useState("");
  const [imgCaption, setImgCaption] = useState("");
  const [imgCopied, setImgCopied] = useState(false);
  const syncing = useRef(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || syncing.current) return;
    if (el.innerHTML !== value) el.innerHTML = value || "";
  }, [value]);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    syncing.current = true;
    onChange(el.innerHTML);
    queueMicrotask(() => {
      syncing.current = false;
    });
  }, [onChange]);

  const run = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const insertHtml = (html: string) => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, html);
    emit();
  };

  const insertLink = () => {
    const url = window.prompt("Link URL:", "https://");
    if (!url) return;
    const text = window.prompt("Link text (optional):", "") || url;
    insertHtml(
      `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeAttr(text)}</a>`
    );
  };

  const openImagePanel = () => {
    setImgUrl("");
    setImgAlt("");
    setImgTitle("");
    setImgCaption("");
    setImgCopied(false);
    setImgOpen(true);
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    try {
      let url: string;
      if (uploadImage) {
        url = await uploadImage(file);
      } else {
        url = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      setImgUrl(url);
      if (!imgAlt.trim()) {
        const base = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
        setImgAlt(base || "Article image");
      }
      setImgOpen(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const copyImgUrl = async () => {
    if (!imgUrl.trim()) return;
    try {
      await navigator.clipboard.writeText(imgUrl.trim());
      setImgCopied(true);
      setTimeout(() => setImgCopied(false), 1500);
    } catch {
      window.prompt("Copy image URL:", imgUrl.trim());
    }
  };

  const insertImageIntoEditor = () => {
    const url = imgUrl.trim();
    const alt = imgAlt.trim();
    if (!url) {
      alert("Image URL is required.");
      return;
    }
    if (!alt) {
      alert("Alt text is required for SEO.");
      return;
    }
    const title = imgTitle.trim() || alt;
    const caption = imgCaption.trim();
    const img = `<img src="${escapeAttr(url)}" alt="${escapeAttr(alt)}" title="${escapeAttr(title)}" loading="lazy" decoding="async" />`;
    const html = caption
      ? `<figure class="article-figure">${img}<figcaption>${escapeAttr(caption)}</figcaption></figure>`
      : `<figure class="article-figure">${img}</figure>`;
    insertHtml(html + "<p><br></p>");
    setImgOpen(false);
  };

  const isEmpty = !value || value === "<br>" || value === "<div><br></div>";

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/[0.03] p-2">
        <Btn title="Bold" onClick={() => run("bold")}><b>B</b></Btn>
        <Btn title="Italic" onClick={() => run("italic")}><i>I</i></Btn>
        <Btn title="Underline" onClick={() => run("underline")}><u>U</u></Btn>
        <Btn title="Strikethrough" onClick={() => run("strikeThrough")}><s>S</s></Btn>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <Btn title="Heading 1" onClick={() => run("formatBlock", "h1")}>H1</Btn>
        <Btn title="Heading 2" onClick={() => run("formatBlock", "h2")}>H2</Btn>
        <Btn title="Heading 3" onClick={() => run("formatBlock", "h3")}>H3</Btn>
        <Btn title="Paragraph" onClick={() => run("formatBlock", "p")}>P</Btn>
        <Btn title="Quote" onClick={() => run("formatBlock", "blockquote")}>❝</Btn>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <select
          className="h-8 rounded-md border border-white/10 bg-slate-900 px-2 text-xs text-slate-300"
          defaultValue="inherit"
          onChange={(e) => run("fontName", e.target.value)}
          title="Font family"
        >
          {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <select
          className="h-8 rounded-md border border-white/10 bg-slate-900 px-2 text-xs text-slate-300"
          defaultValue="3"
          onChange={(e) => run("fontSize", e.target.value)}
          title="Font size"
        >
          {SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <label className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-slate-300 hover:bg-white/10" title="Text color">
          Color
          <input type="color" className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent" onChange={(e) => run("foreColor", e.target.value)} />
        </label>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <Btn title="Align left" onClick={() => run("justifyLeft")}>⫷</Btn>
        <Btn title="Align center" onClick={() => run("justifyCenter")}>☰</Btn>
        <Btn title="Align right" onClick={() => run("justifyRight")}>⫸</Btn>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <Btn title="Bullet list" onClick={() => run("insertUnorderedList")}>• List</Btn>
        <Btn title="Numbered list" onClick={() => run("insertOrderedList")}>1. List</Btn>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <Btn title="Insert / edit link" onClick={insertLink}>🔗 Link</Btn>
        <Btn title="Remove link" onClick={() => run("unlink")}>⛓</Btn>
        <Btn title="Insert image (upload or URL + alt)" onClick={openImagePanel} active={imgOpen}>
          🖼️ Image
        </Btn>
        <Btn title="Upload image file" onClick={() => fileRef.current?.click()}>
          {uploading ? "Uploading…" : "⬆ Upload"}
        </Btn>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
        <Btn title="Horizontal line" onClick={() => run("insertHorizontalRule")}>―</Btn>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <Btn title="Undo" onClick={() => run("undo")}>↶</Btn>
        <Btn title="Redo" onClick={() => run("redo")}>↷</Btn>
        <Btn title="Clear formatting" onClick={() => run("removeFormat")}>Tx</Btn>
      </div>

      {imgOpen && (
        <div className="border-b border-white/10 bg-slate-900/80 p-3 space-y-3" dir="ltr">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-200">Insert image (mid-article)</p>
            <button
              type="button"
              className="text-xs text-slate-500 hover:text-white"
              onClick={() => setImgOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] text-slate-500">Image URL (upload first or paste link)</label>
              <div className="flex flex-wrap gap-2">
                <input
                  className="input-field text-xs flex-1 font-mono"
                  placeholder="/api/v1/uploads/... or https://..."
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                />
                <button type="button" className="btn-secondary text-xs py-1.5 px-2" onClick={() => fileRef.current?.click()}>
                  {uploading ? "…" : "Upload"}
                </button>
                <button type="button" className="btn-secondary text-xs py-1.5 px-2" onClick={copyImgUrl} disabled={!imgUrl.trim()}>
                  {imgCopied ? "Copied" : "Copy link"}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-slate-500">Alt text (SEO · required)</label>
              <input
                className="input-field text-xs"
                placeholder="Describe the image for SEO & accessibility"
                value={imgAlt}
                onChange={(e) => setImgAlt(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-slate-500">Title attribute</label>
              <input
                className="input-field text-xs"
                placeholder="Optional hover title"
                value={imgTitle}
                onChange={(e) => setImgTitle(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] text-slate-500">Caption (optional)</label>
              <input
                className="input-field text-xs"
                placeholder="Shown under the image"
                value={imgCaption}
                onChange={(e) => setImgCaption(e.target.value)}
              />
            </div>
          </div>
          {imgUrl.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgUrl} alt={imgAlt || "preview"} className="max-h-36 rounded-lg border border-white/10 object-contain" />
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary text-xs py-1.5 px-3" onClick={insertImageIntoEditor}>
              Insert into article
            </button>
            <button type="button" className="btn-secondary text-xs py-1.5 px-3" onClick={() => setImgOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          dir={dir}
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          className={cn("rich-editor min-h-[280px] max-h-[560px] overflow-y-auto px-4 py-3 text-sm leading-7 text-slate-200 outline-none")}
        />
        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 px-4 py-3 text-sm text-slate-600" dir={dir}>
            {placeholder}
          </div>
        )}
      </div>
      <div className="border-t border-white/5 px-3 py-1.5 text-[10px] text-slate-600">
        Tip: place the cursor where you want the image → Image / Upload → fill Alt text → Insert. You can also Copy link and paste elsewhere.
      </div>
    </div>
  );
}
