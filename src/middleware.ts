import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/booking/session";

export const config = { matcher: ["/admin/:path*"] };

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = pathname === "/admin/login" ? NextResponse.next() : null;
  if (!res) {
    const configured = Boolean(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32);
    const session = configured ? await verifySession(req.cookies.get(SESSION_COOKIE)?.value) : null;
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname + req.nextUrl.search)}`;
      return NextResponse.redirect(url);
    }
  }
  const out = res ?? NextResponse.next();
  out.headers.set("X-Robots-Tag", "noindex, nofollow");
  out.headers.set("Cache-Control", "no-store");
  out.headers.set("X-Frame-Options", "DENY");
  out.headers.set("Referrer-Policy", "same-origin");
  return out;
}
