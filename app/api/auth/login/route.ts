// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// POST /api/auth/login - email + password sign-in with brute-force protection.
import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { staff } from "@/lib/demo-data";
import { signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { clientIp, isSameOrigin, jsonError, readJson } from "@/lib/security";
import { audit } from "@/lib/audit";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(120),
  password: z.string().min(1).max(128),
});

// Used when the email doesn't exist, so response time doesn't reveal valid accounts.
const DUMMY_HASH = "$2b$12$Hf8dImO.l2uZrnLA/aur0.CbnvaL1DWAbKCrzeVhpjp747QP4qV3u";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return jsonError("Invalid request origin.", 403);
  const ip = clientIp(req);

  // 20 attempts per IP per 15 minutes
  const ipLimit = rateLimit(`login-ip:${ip}`, 20, 15 * 60_000);
  if (!ipLimit.ok) {
    audit({ actor: "unknown", action: "login.rate_limited", target: ip, ip, level: "danger" });
    return jsonError(`Too many attempts. Try again in ${Math.ceil(ipLimit.retryAfter / 60)} min.`, 429, { "Retry-After": String(ipLimit.retryAfter) });
  }

  let input: z.infer<typeof schema>;
  try {
    input = schema.parse(await readJson(req, 2_000));
  } catch {
    return jsonError("Enter a valid email and password.", 400);
  }

  // 5 attempts per account per 15 minutes
  const accountKey = `login-acct:${input.email}`;
  const acctLimit = rateLimit(accountKey, 5, 15 * 60_000);
  if (!acctLimit.ok) {
    audit({ actor: "unknown", action: "login.locked", target: input.email, ip, level: "danger" });
    return jsonError(`Account temporarily locked. Try again in ${Math.ceil(acctLimit.retryAfter / 60)} min.`, 429, { "Retry-After": String(acctLimit.retryAfter) });
  }

  const user = staff.find((s) => s.email === input.email);
  const valid = await bcrypt.compare(input.password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !user.passwordHash || !valid || user.status !== "Active") {
    audit({ actor: "unknown", action: "login.failed", target: input.email, ip, level: "warning" });
    return jsonError("Email or password is incorrect.", 401); // same message for every failure
  }

  resetRateLimit(accountKey);
  const token = await signSession({ sub: user.id, name: user.name, email: user.email, role: user.role });
  audit({ actor: user.email, action: "login.success", target: "session", ip, level: "info" });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
