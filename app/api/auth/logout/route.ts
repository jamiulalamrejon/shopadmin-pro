// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// POST /api/auth/logout - clears the session cookie.
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { isSameOrigin, jsonError, clientIp } from "@/lib/security";
import { getSession } from "@/lib/auth";
import { audit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return jsonError("Invalid request origin.", 403);
  const session = await getSession();
  if (session) audit({ actor: session.email, action: "logout", target: "session", ip: clientIp(req), level: "info" });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
  return res;
}
