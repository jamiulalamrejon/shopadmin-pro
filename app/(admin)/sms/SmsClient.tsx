// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import { useState } from "react";
import { LoaderCircle, Send, WandSparkles } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { postSms, smsParts } from "@/components/QuickSms";
import { useAi } from "@/components/useAi";
import { isValidPhone } from "@/lib/phone";
import { dateTime, num } from "@/lib/format";
import type { SmsCampaign, SmsLog, SmsTemplate } from "@/lib/demo-data";

export default function SmsClient({ templates, logs, campaigns, audiences }: {
  templates: SmsTemplate[]; logs: SmsLog[]; campaigns: SmsCampaign[]; audiences: Record<string, string[]>;
}) {
  const toast = useToast();
  const { generate, loading: aiLoading } = useAi();
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [numbers, setNumbers] = useState("");
  const [audience, setAudience] = useState(Object.keys(audiences)[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<SmsLog[]>(logs);
  const { parts, unicode } = smsParts(message);

  const recipients = mode === "single"
    ? numbers.split(/[\s,;]+/).map((n) => n.trim()).filter(Boolean)
    : audiences[audience] ?? [];

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!recipients.length) return setError("Add at least one phone number");
    const bad = recipients.find((n) => !isValidPhone(n));
    if (bad) return setError(`${bad} isn't a valid phone number. Use +countrycode format.`);
    if (!message.trim()) return setError("Write a message first");
    setSending(true);
    try {
      let sent = 0, provider = "";
      for (let i = 0; i < recipients.length; i += 100) { // API accepts 100 numbers per request
        const r = await postSms(recipients.slice(i, i + 100), message);
        sent += r.sent; provider = r.provider;
      }
      toast(`${sent} SMS sent via ${provider}`);
      setHistory((h) => [
        ...recipients.slice(0, 5).map((to) => ({ id: crypto.randomUUID(), to, message, status: "Queued" as const, provider, at: new Date().toISOString() })),
        ...h,
      ]);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "SMS failed");
    } finally {
      setSending(false);
    }
  }

  async function aiWrite() {
    try {
      const r = await generate("sms_copy", message || "Promote our winter sale with 15% off");
      setMessage(r.text.slice(0, 480));
    } catch (err) {
      toast(err instanceof Error ? err.message : "AI failed", "error");
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card title="Compose SMS" className="xl:col-span-2">
        <div className="mb-4 inline-flex rounded-lg bg-slate-100 p-1 text-sm">
          {(["single", "bulk"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-md px-3 py-1.5 ${mode === m ? "bg-white font-medium shadow-sm" : "text-slate-600"}`}>
              {m === "single" ? "Single / list" : "Campaign"}
            </button>
          ))}
        </div>
        <form onSubmit={send} className="space-y-4" noValidate>
          {mode === "single" ? (
            <div>
              <label className="label" htmlFor="numbers">Phone numbers (comma or new line separated)</label>
              <textarea id="numbers" rows={2} value={numbers} onChange={(e) => setNumbers(e.target.value)} placeholder="+14155550123, +447700900123" className="input font-mono" />
            </div>
          ) : (
            <div>
              <label className="label" htmlFor="audience">Audience</label>
              <select id="audience" value={audience} onChange={(e) => setAudience(e.target.value)} className="input">
                {Object.entries(audiences).map(([k, v]) => <option key={k} value={k}>{k} ({v.length})</option>)}
              </select>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between">
              <label className="label" htmlFor="msg">Message</label>
              <button type="button" onClick={aiWrite} disabled={aiLoading} className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-brand-600">
                {aiLoading ? <LoaderCircle size={13} className="animate-spin" /> : <WandSparkles size={13} />} Write with AI
              </button>
            </div>
            <textarea id="msg" rows={5} maxLength={480} value={message} onChange={(e) => setMessage(e.target.value)} className="input" placeholder="Dear customer, your order has been shipped." />
            <p className="mt-1 text-xs text-slate-500">{message.length}/480 characters · {parts} SMS per recipient{unicode ? " · Unicode" : ""} · {recipients.length} recipients</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary w-full sm:w-auto" disabled={sending}>{sending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />} Send to {recipients.length || 0}</button>
        </form>
      </Card>

      <Card title="Templates">
        <ul className="space-y-3">
          {templates.map((t) => (
            <li key={t.id}>
              <button type="button" onClick={() => setMessage(t.body)} className="w-full rounded-lg border border-slate-200 p-3 text-left hover:border-brand-500">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{t.body}</p>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Campaigns" className="xl:col-span-1">
        <ul className="space-y-3">
          {campaigns.map((c) => (
            <li key={c.id} className="flex items-center justify-between text-sm">
              <span>{c.name}<span className="block text-xs text-slate-400">{c.audience} · {num(c.recipients)}</span></span>
              <Badge>{c.status}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Delivery log" className="xl:col-span-2">
        <div className="-mx-5 max-h-96 overflow-auto sm:-mx-6">
          <table className="w-full">
            <thead className="sticky top-0 bg-page"><tr>
              <th className="table-th">To</th><th className="table-th">Message</th><th className="table-th">Time</th><th className="table-th">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((l) => (
                <tr key={l.id}>
                  <td className="table-td font-mono text-xs">{l.to}</td>
                  <td className="table-td max-w-xs truncate text-slate-600">{l.message}</td>
                  <td className="table-td text-slate-500">{dateTime(l.at)}</td>
                  <td className="table-td"><Badge>{l.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
