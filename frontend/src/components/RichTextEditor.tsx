"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  uploadImage?: (file: File) => Promise<string>;
  dir?: "ltr" | "rtl";
}

const FONTS = [
  { label: "پیش‌فرض", value: "inherit" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
  { label: "Vazirmatn", value: "Vazirmatn, Tahoma, sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
];

const SIZES = [
  { label: "کوچک", value: "2" },
  { label: "عادی", value: "3" },
  { label: "متوسط", value: "4" },
  { label: "بزرگ", value: "5" },
  { label: "خیلی بزرگ", value: "6" },
  { label: "عنوان", value: "7" },
];

function ToolbarBtn({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "متن مقاله را بنویسید…",
  uploadImage,
  dir = "rtl",
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const syncing = useRef(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || syncing.current) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
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

  const insertLink = () => {
    const url = window.prompt("آدرس لینک:", "https://");
    if (!url) return;
    run("createLink", url);
  };

  const insertImageUrl = () => {
    const url = window.prompt("آدرس تصویر (URL):", "https://");
    if (!url) return;
    run("insertImage", url);
  };

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (!uploadImage) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") run("insertImage", reader.result);
      };
      reader.readAsDataURL(file);
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      run("insertImage", url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "آپلود تصویر ناموفق بود");
    } finally {
      setUploading(false);
    }
  };

  const isEmpty = !value || value === "<br>" || value === "<div><br></div>";

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/[0.03] p-2">
        <ToolbarBtn title="پررنگ" onClick={() => run("bold")}><b>B</b></ToolbarBtn>
        <ToolbarBtn title="ایتالیک" onClick={() => run("italic")}><i>I</i></ToolbarBtn>
        <ToolbarBtn title="زیرخط" onClick={() => run("underline")}><u>U</u></ToolbarBtn>
        <ToolbarBtn title="خط‌خورده" onClick={() => run("strikeThrough")}><s>S</s></ToolbarBtn>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <ToolbarBtn title="عنوان ۱" onClick={() => run("formatBlock", "h1")}>H1</ToolbarBtn>
        <ToolbarBtn title="عنوان ۲" onClick={() => run("formatBlock", "h2")}>H2</ToolbarBtn>
        <ToolbarBtn title="عنوان ۳" onClick={() => run("formatBlock", "h3")}>H3</ToolbarBtn>
        <ToolbarBtn title="پاراگراف" onClick={() => run("formatBlock", "p")}>P</ToolbarBtn>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <select
          className="h-8 rounded-md border border-white/10 bg-slate-900 px-2 text-xs text-slate-300"
          defaultValue="inherit"
          onChange={(e) => run("fontName", e.target.value)}
          title="فونت"
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select
          className="h-8 rounded-md border border-white/10 bg-slate-900 px-2 text-xs text-slate-300"
          defaultValue="3"
          onChange={(e) => run("fontSize", e.target.value)}
          title="اندازه فونت"
        >
          {SIZES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <label className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-slate-300 hover:bg-white/10" title="رنگ متن">
          رنگ
          <input type="color" className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent" onChange={(e) => run("foreColor", e.target.value)} />
        </label>

        <label className="flex h-8 items-center gap-1 rounded-md px-2 text-xs text-slate-300 hover:bg-white/10" title="رنگ پس‌زمینه">
          هایلایت
          <input type="color" className="h-5 w-5 cursor-pointer rounded border-0 bg-transparent" defaultValue="#fbbf24" onChange={(e) => run("hiliteColor", e.target.value)} />
        </label>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <ToolbarBtn title="راست‌چین" onClick={() => run("justifyRight")}>☰→</ToolbarBtn>
        <ToolbarBtn title="وسط" onClick={() => run("justifyCenter")}>☰</ToolbarBtn>
        <ToolbarBtn title="چپ‌چین" onClick={() => run("justifyLeft")}>←☰</ToolbarBtn>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <ToolbarBtn title="لیست نقطه‌ای" onClick={() => run("insertUnorderedList")}>• ≡</ToolbarBtn>
        <ToolbarBtn title="لیست عددی" onClick={() => run("insertOrderedList")}>1. ≡</ToolbarBtn>
        <ToolbarBtn title="نقل‌قول" onClick={() => run("formatBlock", "blockquote")}>❝</ToolbarBtn>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <ToolbarBtn title="لینک" onClick={insertLink}>🔗</ToolbarBtn>
        <ToolbarBtn title="تصویر با URL" onClick={insertImageUrl}>🖼️</ToolbarBtn>
        <ToolbarBtn title="آپلود تصویر" onClick={() => fileRef.current?.click()}>
          {uploading ? "…" : "⬆ تصویر"}
        </ToolbarBtn>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />

        <span className="mx-1 h-5 w-px bg-white/10" />

        <ToolbarBtn title="بازگردانی" onClick={() => run("undo")}>↶</ToolbarBtn>
        <ToolbarBtn title="ازنو" onClick={() => run("redo")}>↷</ToolbarBtn>
        <ToolbarBtn title="پاک کردن فرمت" onClick={() => run("removeFormat")}>Tx</ToolbarBtn>
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          dir={dir}
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          className="rich-editor min-h-[240px] max-h-[520px] overflow-y-auto px-4 py-3 text-sm leading-7 text-slate-200 outline-none"
        />
        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 px-4 py-3 text-sm text-slate-600" dir={dir}>
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
