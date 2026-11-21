// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// POST /api/sms/send - send one SMS or a small batch (max 100 numbers per request).
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { guardApi, jsonError, readJson, clientIp } from "@/lib/security";
import { normalizePhone, sendSms } from "@/lib/sms";
import { audit } from "@/lib/audit";

const schema = z.object({
  to: z.array(z.string().max(20)).min(1).max(100),
  message: z.string().trim().min(1).max(480),
});

export async function POST(req: NextRequest) {
  const guard = await guardApi(req, "sms:send", { max: 20, windowMs: 60_000 });
  if (guard.error) return guard.error;

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await readJson(req));
  } catch {
    return jsonError("Add at least one number and a message (max 480 characters).", 400);
  }

  const numbers = [...new Set(input.to.map(normalizePhone))];
  if (numbers.some((n) => n === null)) return jsonError("One or more phone numbers are not valid. Use +countrycode format, e.g. +14155550123.", 400);

  const results = [];
  for (const n of numbers as string[]) results.push(await sendSms(n, input.message));

  const sent = results.filter((r) => r.ok).length;
  audit({ actor: guard.session.email, action: "sms.send", target: `${sent}/${numbers.length} recipients`, ip: clientIp(req), level: "info" });

  return NextResponse.json({
    sent,
    failed: numbers.length - sent,
    provider: results[0]?.provider,
    error: results.find((r) => !r.ok)?.error,
  });
}
