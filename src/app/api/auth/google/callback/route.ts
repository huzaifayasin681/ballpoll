import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";
import { newReferralCode } from "@/lib/crypto";
import { site } from "@/lib/site";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const saved = req.cookies.get("gps_oauth_state")?.value;
  if (!code || !saved) return NextResponse.redirect(new URL("/login?error=google", req.url));

  const parsed = JSON.parse(saved) as { state: string; next: string };
  if (parsed.state !== state) return NextResponse.redirect(new URL("/login?error=google", req.url));

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${site.url}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokens = (await tokenRes.json()) as { access_token?: string };
    if (!tokens.access_token) throw new Error("no token");

    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const p = (await profileRes.json()) as { sub: string; email: string; name?: string };
    const email = p.email.toLowerCase();

    let user = await db.user.findFirst({ where: { OR: [{ googleId: p.sub }, { email }] } });
    if (!user) {
      const ref = req.cookies.get("gps_ref")?.value;
      const referrer = ref ? await db.user.findUnique({ where: { referralCode: ref.toUpperCase() } }) : null;
      user = await db.user.create({
        data: { email, name: p.name, googleId: p.sub, referralCode: newReferralCode(), referredById: referrer?.id },
      });
    } else if (!user.googleId) {
      user = await db.user.update({ where: { id: user.id }, data: { googleId: p.sub } });
    }
    await createSession({ userId: user.id, role: user.role });
    const next = parsed.next.startsWith("/") && !parsed.next.startsWith("//") ? parsed.next : "/dashboard";
    const res = NextResponse.redirect(new URL(next, req.url));
    res.cookies.delete("gps_oauth_state");
    return res;
  } catch {
    return NextResponse.redirect(new URL("/login?error=google", req.url));
  }
}
