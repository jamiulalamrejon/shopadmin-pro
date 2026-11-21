// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import { useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import { useAi } from "./useAi";

export default function AiInsight({ summary }: { summary: string }) {
  const { generate, loading } = useAi();
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function run() {
    setError("");
    try {
      const r = await generate("insights", summary);
      setText(r.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI failed");
    }
  }

  return (
    <div>
      {text ? (
        <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700">{text}</p>
      ) : (
        <p className="text-sm text-slate-500">Get AI suggestions based on this month&apos;s sales, stock and orders.</p>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <button onClick={run} disabled={loading} className="btn-secondary mt-4 w-full">
        {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Sparkles size={16} />} {text ? "Refresh insights" : "Generate insights"}
      </button>
    </div>
  );
}
