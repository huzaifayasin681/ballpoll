import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Role } from "@/generated/prisma/enums";

const COOKIE = "gps_session";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export type SessionPayload = { userId: string; role: Role };

function secret() {
  const s = process.env.SESSION_SECRET || "globalpool-default-session-secret-key-2026-min32";
  return new TextEncoder().encode(s.padEnd(32, "0"));
}

export async function encodeSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function decodeSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return { userId: String(payload.userId), role: payload.role as Role };
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const token = await encodeSession(payload);
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function readSession() {
  const store = await cookies();
  return decodeSession(store.get(COOKIE)?.value);
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export const SESSION_COOKIE = COOKIE;
