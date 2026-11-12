import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 proxy: captures `?ref=CODE` referral links into a 30-day cookie
 * and sets baseline security headers.
 */
export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const ref = req.nextUrl.searchParams.get("ref");
  if (ref && /^[A-Za-z0-9]{4,20}$/.test(ref)) {
    res.cookies.set("gps_ref", ref.toUpperCase(), { maxAge: 60 * 60 * 24 * 30, path: "/", sameSite: "lax" });
  }
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
