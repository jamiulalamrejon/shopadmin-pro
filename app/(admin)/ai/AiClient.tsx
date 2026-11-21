// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import { useEffect, useRef, useState } from "react";
import { Bot, Copy, LoaderCircle, Send } from "lucide-react";
import { useAi, type AiTask } from "@/components/useAi";
import { useToast } from "@/components/Toast";
import { Avatar } from "@/components/ui";

const TASKS: { id: AiTask; label: string; hint: string }[] = [
  { id: "chat", label: "Ask anything", hint: "How can I reduce COD order cancellations?" },
  { id: "product_description", label: "Product description", hint: "Wireless earbuds with 30h battery, black colour" },
  { id: "blog_post", label: "Blog post", hint: "5 ways to keep your car safe with a GPS tracker" },
  { id: "sms_copy", label: "SMS copy", hint: "Eid sale 20% off on fashion items" },
  { id: "reply_customer", label: "Customer reply", hint: "Customer says order #1052 arrived late and the box was damaged" },
];

type Msg = { role: "user" | "ai"; text: string; task: AiTask };

export default function AiClient() {
  const { generate, loading } = useAi();
  const toast = useToast();
  const [task, setTask] = useState<AiTask>("chat");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", task: "chat", text: "Hi! I'm your store assistant. Pick a task above, describe what you need, and I'll write it for you." },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  // Scroll only the chat box (not the whole page) to the newest message.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const prompt = input.trim();
    if (prompt.length < 2) return setError("Write a prompt first");
    setError("");
    setInput("");
    setMessages((m) => [...m, { role: "user", text: prompt, task }]);
    try {
      const r = await generate(task, prompt);
      setMessages((m) => [...m, { role: "ai", text: r.text, task }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "ai", text: err instanceof Error ? err.message : "Something went wrong.", task }]);
    }
  }

  const current = TASKS.find((t) => t.id === task)!;

  return (
    <div className="card flex h-[calc(100dvh-15.5rem)] min-h-[420px] flex-col lg:h-[calc(100dvh-12rem)]">
      <div className="flex gap-2 overflow-x-auto border-b border-slate-100 p-3 [scrollbar-width:none]">
        {TASKS.map((t) => (
          <button key={t.id} onClick={() => setTask(t.id)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium ${task === t.id ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "ai" ? <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-600 text-white"><Bot size={16} /></span> : <Avatar name="You" />}
            <div className={`group relative max-w-[85%] rounded-2xl sm:max-w-[75%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${m.role === "user" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-800"}`}>
              {m.text}
              {m.role === "ai" && i > 0 && (
                <button onClick={() => { navigator.clipboard.writeText(m.text); toast("Copied"); }} aria-label="Copy"
                  className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-600 sm:absolute sm:top-1 sm:-right-9 sm:mt-0 sm:hidden sm:size-7 sm:place-items-center sm:rounded-md sm:text-slate-400 sm:group-hover:grid"><Copy size={14} /><span className="sm:hidden">Copy</span></button>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle size={16} className="animate-spin" /> Thinking…</div>}
      </div>
      <form onSubmit={send} className="border-t border-slate-100 p-3">
        <div className="flex gap-2">
          <input value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} maxLength={4000} placeholder={current.hint} className="input" aria-label="Prompt" />
          <button className="btn-primary h-11 shrink-0 sm:h-10" disabled={loading} aria-label="Send"><Send size={16} /><span className="hidden sm:inline">Send</span></button>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </form>
    </div>
  );
}
