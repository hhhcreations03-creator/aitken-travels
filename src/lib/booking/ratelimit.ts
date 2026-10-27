import "server-only";
import crypto from "node:crypto";
import { headers } from "next/headers";
import { db } from "./db";
import { ensureSchema } from "./schema";

/** Client IP from Vercel's forwarding headers, hashed so raw IPs are never stored. */
export function clientKey(): string {
  const h = headers();
  const ip = h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return crypto.createHash("sha256").update(`${ip}:${process.env.SESSION_SECRET ?? "lh"}`).digest("hex").slice(0, 32);
}

/**
 * Sliding-window limiter backed by the database (works across serverless instances).
 * Returns true when the action is allowed, and records it.
 */
export async function rateLimit(bucket: string, max: number, windowMinutes: number): Promise<boolean> {
  await ensureSchema();
  const d = await db();
  const key = `${bucket}:${clientKey()}`;
  const [row] = await d.query<{ n: number }>(
    `SELECT count(*)::int AS n FROM rate_limits WHERE bucket = $1 AND at > now() - ($2 || ' minutes')::interval`,
    [key, String(windowMinutes)]
  );
  if ((row?.n ?? 0) >= max) return false;
  await d.query(`INSERT INTO rate_limits (bucket) VALUES ($1)`, [key]);
  if (Math.random() < 0.05) await d.query(`DELETE FROM rate_limits WHERE at < now() - interval '1 day'`);
  return true;
}
