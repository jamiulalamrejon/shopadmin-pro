// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Next.js 16 proxy (formerly "middleware"): runs before every matched request.
// Blocks signed-out users and enforces role permissions on pages and APIs.
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import { can, ROUTE_PERMISSIONS } from "@/lib/rbac";

const PUBLIC_PATHS = ["/login", "/api/auth/login"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  const isApi = pathname.startsWith("/api/");

  if (PUBLIC_PATHS.includes(pathname)) {
    if (session && pathname === "/login") return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  }

  if (!session) {
    if (isApi) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    const url = new URL("/login", req.url);
    if (pathname !== "/") url.searchParams.set("next", pathname);
    const res = NextResponse.redirect(url);
    res.cookies.delete(SESSION_COOKIE); // drop expired/tampered cookies
    return res;
  }

  const rule = ROUTE_PERMISSIONS.find((r) => pathname === r.prefix || pathname.startsWith(r.prefix + "/"));
  if (rule && !can(session.role, rule.permission)) {
    return NextResponse.redirect(new URL("/dashboard?denied=1", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Everything except static files and images.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
