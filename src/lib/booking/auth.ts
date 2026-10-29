import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_HOURS, adminEmail, signSession, verifySession, type Session } from "./session";

/**
 * Password hashes look like: scrypt:<N>:<r>:<p>:<salt b64>:<hash b64>
 * Colons, not dollar signs, so .env files don't treat parts as variables.
 * Generate one with `npm run admin:password`.
 *
 * Undo common paste mistakes: the "ADMIN_PASSWORD_HASH=" prefix, quotes, stray spaces or line breaks.
 */
export function normaliseHash(stored: string): string {
  return stored.replace(/\s+/g, "").replace(/^ADMIN_PASSWORD_HASH=/, "").replace(/^["']+|["']+$/g, "");
}

/** True when ADMIN_PASSWORD_HASH has the shape `npm run admin:password` prints. */
export function hashLooksValid(stored = process.env.ADMIN_PASSWORD_HASH ?? ""): boolean {
  const parts = normaliseHash(stored).split(/[:$]/);
  return parts.length === 6 && parts[0] === "scrypt" && parts.slice(1, 4).every((n) => /^\d+$/.test(n)) && parts[4].length > 0 && parts[5].length > 0;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!hashLooksValid(stored)) return false;
  const parts = normaliseHash(stored).split(/[:$]/);
  const [, N, r, p, salt, hash] = parts;
  const expected = Buffer.from(hash, "base64");
  const actual = crypto.scryptSync(password, Buffer.from(salt, "base64"), expected.length, {
    N: Number(N), r: Number(r), p: Number(p), maxmem: 256 * 1024 * 1024,
  });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

export function checkCredentials(email: string, password: string): boolean {
  const expectedEmail = adminEmail();
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  // Always run the hash so response time doesn't reveal whether the email matched.
  const passwordOk = hash ? verifyPassword(password, hash) : false;
  return Boolean(expectedEmail) && email.trim().toLowerCase() === expectedEmail && passwordOk;
}

export async function startSession(email: string) {
  cookies().set(SESSION_COOKIE, await signSession(email.trim().toLowerCase()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export function endSession() {
  cookies().delete(SESSION_COOKIE);
}

export async function currentAdmin(): Promise<Session | null> {
  return verifySession(cookies().get(SESSION_COOKIE)?.value);
}

/** Use at the top of every admin page and server action. Middleware is the first gate; this is the second. */
export async function requireAdmin(): Promise<Session> {
  const s = await currentAdmin();
  if (!s) redirect("/admin/login");
  return s;
}

/** Rejects cross-site form posts to admin routes (defence in depth alongside SameSite cookies). */
export function assertSameOrigin() {
  const h = headers();
  const origin = h.get("origin");
  const host = h.get("x-forwarded-host") || h.get("host");
  if (origin && host && new URL(origin).host !== host) throw new Error("Cross-origin request blocked");
}
