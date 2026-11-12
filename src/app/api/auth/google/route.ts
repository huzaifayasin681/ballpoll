import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { site } from "@/lib/site";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const next = req.nextUrl.searchParams.get("next") || "/dashboard";
  if (!clientId) {
    return NextResponse.redirect(new URL(`/login?error=google_disabled&next=${encodeURIComponent(next)}`, req.url));
  }
  const state = randomBytes(16).toString("hex");
  const redirectUri = `${site.url}/api/auth/google/callback`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  const res = NextResponse.redirect(url);
  res.cookies.set("gps_oauth_state", JSON.stringify({ state, next }), { httpOnly: true, maxAge: 600, path: "/" });
  return res;
}
