// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// POST /api/ai/generate - runs one of the server-defined AI tasks.
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { guardApi, jsonError, readJson, clientIp } from "@/lib/security";
import { AI_TASKS, generateText, type AiTask } from "@/lib/ai";
import { audit } from "@/lib/audit";

const schema = z.object({
  task: z.enum(Object.keys(AI_TASKS) as [AiTask, ...AiTask[]]),
  prompt: z.string().trim().min(2).max(4000),
});

export async function POST(req: NextRequest) {
  const guard = await guardApi(req, "ai:use", { max: 15, windowMs: 60_000 });
  if (guard.error) return guard.error;

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await readJson(req));
  } catch {
    return jsonError("Choose a valid task and write a prompt (max 4000 characters).", 400);
  }

  try {
    const result = await generateText(input.task, input.prompt);
    audit({ actor: guard.session.email, action: `ai.${input.task}`, target: input.prompt.slice(0, 40), ip: clientIp(req), level: "info" });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[ai]", e instanceof Error ? e.message : e);
    return jsonError("The AI service didn't respond. Try again.", 502);
  }
}
