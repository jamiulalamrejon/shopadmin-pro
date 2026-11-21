// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Signed, httpOnly JWT sessions (HS256 via jose). Safe to import from proxy.ts.
import { SignJWT, jwtVerify } from "jose";
import { isRole, type Role } from "./rbac";

export const SESSION_COOKIE = "admin_session";
export const SESSION_HOURS = Math.min(Math.max(Number(process.env.SESSION_HOURS) || 8, 1), 24);

export type Session = { sub: string; name: string; email: string; role: Role };

let warned = false;
function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be set (min 32 characters) in production.");
  }
  if (!warned) {
    console.warn("[security] AUTH_SECRET missing or too short - using an insecure dev secret. Run `npm run gen-secret`.");
    warned = true;
  }
  return new TextEncoder().encode("dev-only-insecure-secret-change-me-please-0000");
}

export async function signSession(s: Session): Promise<string> {
  return new SignJWT({ name: s.name, email: s.email, role: s.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(s.sub)
    .setIssuedAt()
    .setIssuer("ecommerce-admin")
    .setAudience("ecommerce-admin")
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getSecret());
}

export async function verifySession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
      issuer: "ecommerce-admin",
      audience: "ecommerce-admin",
    });
    if (!payload.sub || !isRole(payload.role)) return null;
    return { sub: payload.sub, name: String(payload.name), email: String(payload.email), role: payload.role };
  } catch {
    return null;
  }
}

// Production cookies are HTTPS-only. Set ALLOW_INSECURE_HTTP=true only to test `npm start` on plain http://localhost.
export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" && process.env.ALLOW_INSECURE_HTTP !== "true",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_HOURS * 60 * 60,
};
