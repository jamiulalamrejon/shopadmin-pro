// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
"use client";
import { useState } from "react";

export type AiTask = "chat" | "product_description" | "blog_post" | "sms_copy" | "insights" | "reply_customer";

/** Calls the secured /api/ai/generate endpoint. */
export function useAi() {
  const [loading, setLoading] = useState(false);
  async function generate(task: AiTask, prompt: string): Promise<{ text: string; provider: string }> {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ task, prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI request failed.");
      return data;
    } finally {
      setLoading(false);
    }
  }
  return { generate, loading };
}
