// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// AI integration (Anthropic Claude or OpenAI). Set AI_PROVIDER in .env.local.
// System prompts live on the server, so the browser can only choose a task, not rewrite the instructions.
import "server-only";

export const AI_TASKS = {
  chat: "You are a helpful assistant inside an e-commerce admin panel for an online store. Answer briefly and practically. Prices are in US dollars ($).",
  product_description: "Write a persuasive, SEO-friendly product description (80-120 words) for an online store. Plain text, no markdown, no emojis.",
  blog_post: "Write a helpful blog post (300-450 words) for an online store. Plain text with short paragraphs and a title on the first line. No markdown symbols.",
  sms_copy: "Write one promotional SMS under 155 characters for an online store. Plain text only, include a clear call to action.",
  insights: "You are an e-commerce analyst. Given store numbers, give 4 short, actionable bullet insights. Use '- ' for bullets.",
  reply_customer: "Write a polite, short customer-support reply for an online store. Plain text.",
} as const;

export type AiTask = keyof typeof AI_TASKS;

export function aiProviderName(): string {
  return (process.env.AI_PROVIDER || "demo").toLowerCase();
}

export function aiConfigured(): boolean {
  const p = aiProviderName();
  return (p === "anthropic" && !!process.env.ANTHROPIC_API_KEY) || (p === "openai" && !!process.env.OPENAI_API_KEY);
}

export async function generateText(task: AiTask, prompt: string): Promise<{ text: string; provider: string }> {
  const system = AI_TASKS[task];
  const provider = aiProviderName();
  const signal = AbortSignal.timeout(45_000);

  if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "claude-sonnet-5-5",
        max_tokens: 1024,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
      signal,
    });
    if (!res.ok) throw new Error(`AI provider error ${res.status}`);
    const data = await res.json();
    const text = (data.content ?? []).filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("\n");
    return { text, provider };
  }

  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        max_tokens: 1024,
        messages: [{ role: "system", content: system }, { role: "user", content: prompt }],
      }),
      signal,
    });
    if (!res.ok) throw new Error(`AI provider error ${res.status}`);
    const data = await res.json();
    return { text: data.choices?.[0]?.message?.content ?? "", provider };
  }

  return { text: demoAnswer(task, prompt), provider: "demo" };
}

// Canned answers so the dashboard works without any API key.
function demoAnswer(task: AiTask, prompt: string): string {
  const topic = prompt.slice(0, 80).trim() || "your product";
  switch (task) {
    case "product_description":
      return `${topic} is built for everyday use and made to last. Carefully selected for quality, it offers great value at a fair price. Order today for fast tracked shipping, secure card or PayPal checkout, and easy 30-day returns if you're not fully satisfied.\n\n(Demo AI - add an API key in .env.local for real results.)`;
    case "blog_post":
      return `${topic}\n\nShopping online has never been easier. In this post we share practical tips to help you choose well and save money.\n\nFirst, compare features, not only prices. A slightly higher price often means better warranty and support.\n\nSecond, check reviews from real buyers and look for clear return policies.\n\nFinally, pay with secure options like card or PayPal.\n\nReady to shop? Browse our latest collection today.\n\n(Demo AI - add an API key in .env.local for real results.)`;
    case "sms_copy":
      return "Winter sale is LIVE! Get 15% off all items with code WINTER15. Free shipping over $50. Shop now before Friday!";
    case "insights":
      return "- Revenue is up 12% month over month; Electronics drives most of the growth.\n- 3 products are almost out of stock - raise a purchase order for GPS Tracker V3 first.\n- Abandoned carts are worth $4.8k this week; send a 10% recovery SMS within 1 hour.\n- Net margin is 31%; shipping costs grew fastest - renegotiate carrier rates.\n\n(Demo AI)";
    case "reply_customer":
      return "Dear customer, thank you for contacting us. We're sorry for the inconvenience. Your order is being checked by our team and we'll update you within 24 hours. Thank you for your patience.";
    default:
      return `Demo AI answer for: "${topic}".\n\nI can write product descriptions, blog posts, SMS copy and sales insights. Add ANTHROPIC_API_KEY or OPENAI_API_KEY in .env.local and set AI_PROVIDER to get real answers.`;
  }
}
