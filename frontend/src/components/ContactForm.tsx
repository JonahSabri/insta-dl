"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Support Request");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      setStatus("err");
      return;
    }
    const body = [
      `Name: ${name || "—"}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\n");
    const href = `mailto:contact@jazzghost.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setStatus("ok");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-lg font-bold text-white">Send a message</h2>
      <p className="text-sm text-slate-500">
        Or email us directly at{" "}
        <a href="mailto:contact@jazzghost.com" className="text-purple-300 underline">contact@jazzghost.com</a>
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="input-field text-sm" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input-field text-sm" type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <select className="input-field text-sm" value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option>Support Request</option>
        <option>Copyright Concern</option>
        <option>Privacy Request</option>
        <option>Business Inquiry</option>
        <option>Legal Request</option>
        <option>Other</option>
      </select>
      <textarea
        className="input-field text-sm min-h-[140px]"
        required
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {status === "ok" && <p className="text-sm text-green-400">Opening your email client…</p>}
      {status === "err" && <p className="text-sm text-red-400">Please fill in email and message.</p>}
      <button type="submit" className="btn-primary text-sm">Send message</button>
    </form>
  );
}
