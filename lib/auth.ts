// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Server-only helpers for reading the current user in pages and API routes.
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession, type Session } from "./session";
import { can, type Permission } from "./rbac";

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/** For pages: redirects to /login when signed out. Returns the session and whether the permission is granted. */
export async function requirePage(permission: Permission) {
  const session = await getSession();
  if (!session) redirect("/login");
  return { session, allowed: can(session.role, permission) };
}
