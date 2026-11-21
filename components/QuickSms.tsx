// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import { useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { useToast } from "./Toast";
import { isValidPhone } from "@/lib/phone";

/** Counts SMS parts: 160 chars (GSM) or 70 chars (Unicode, e.g. Bangla/Arabic/emoji) per part. */
export function smsParts(text: string) {
  const unicode = /[^\x00-\x7F]/.test(text);
  const single = unicode ? 70 : 160, multi = unicode ? 67 : 153;
  const parts = text.length <= single ? 1 : Math.ceil(text.length / multi);
  return { parts: text.length ? parts : 0, unicode };
}

export async function postSms(to: string[], message: string) {
  const res = await fetch("/api/sms/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ to, message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "SMS failed.");
  return data as { sent: number; failed: number; provider: string; error?: string };
}

export default function QuickSms({ compact }: { compact?: boolean }) {
  const toast = useToast();
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { parts, unicode } = smsParts(message);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidPhone(to)) return setError("Enter a valid number like +14155550123");
    if (!message.trim()) return setError("Write a message first");
    setLoading(true);
    try {
      const r = await postSms([to], message);
      toast(r.sent ? `SMS sent via ${r.provider}` : r.error || "SMS failed", r.sent ? "success" : "error");
      if (r.sent) setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "SMS failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={send} className="space-y-3" noValidate>
      <input value={to} onChange={(e) => { setTo(e.target.value); setError(""); }} placeholder="+14155550123" className="input" inputMode="tel" maxLength={16} aria-label="Phone number" />
      <textarea value={message} onChange={(e) => { setMessage(e.target.value); setError(""); }} rows={compact ? 2 : 4} maxLength={480} placeholder="Your order has been shipped." className="input" aria-label="Message" />
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{message.length}/480 · {parts} SMS{unicode ? " · Unicode" : ""}</span>
        <button className="btn-primary h-8" disabled={loading}>{loading ? <LoaderCircle size={14} className="animate-spin" /> : <Send size={14} />} Send</button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
