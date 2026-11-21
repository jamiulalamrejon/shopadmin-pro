// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Request-level security helpers shared by API routes.
import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "./auth";
import { can, type Permission } from "./rbac";
import { rateLimit } from "./rate-limit";

export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** CSRF defence: state-changing requests must come from our own origin. */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function jsonError(message: string, status: number, extra?: Record<string, string>) {
  return NextResponse.json({ error: message }, { status, headers: extra });
}

/** One call per protected API route: origin check + login + permission + rate limit. */
export async function guardApi(req: NextRequest, permission: Permission, limit = { max: 30, windowMs: 60_000 }) {
  if (!isSameOrigin(req)) return { error: jsonError("Invalid request origin.", 403) };
  const session = await getSession();
  if (!session) return { error: jsonError("Your session expired. Sign in again.", 401) };
  if (!can(session.role, permission)) return { error: jsonError("You don't have permission for this action.", 403) };
  const rl = rateLimit(`${permission}:${session.sub}`, limit.max, limit.windowMs);
  if (!rl.ok) return { error: jsonError("Too many requests. Try again shortly.", 429, { "Retry-After": String(rl.retryAfter) }) };
  return { session };
}

/** Reads a JSON body with a size cap so huge payloads can't exhaust memory. */
export async function readJson(req: NextRequest, maxBytes = 20_000): Promise<unknown> {
  const text = await req.text();
  if (text.length > maxBytes) throw new Error("Payload too large");
  return JSON.parse(text);
}
