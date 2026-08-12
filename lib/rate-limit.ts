import "server-only";

import { prisma } from "@/lib/prisma";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Fixed-window rate limiter backed by Postgres.
 *
 * Serverless instances do not share memory, so an in-process counter would reset
 * on every cold start and let an attacker cycle instances. The database is the
 * only state every instance already shares, and at our volumes the extra upsert
 * is cheaper than an unmetered OpenAI call.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const windowMs = windowSeconds * 1000;
  const bucket = new Date(Math.floor(Date.now() / windowMs) * windowMs);
  const retryAfterSeconds = Math.ceil((bucket.getTime() + windowMs - Date.now()) / 1000);

  try {
    const row = await prisma.rateLimit.upsert({
      where: { key_bucket: { key, bucket } },
      create: { key, bucket, count: 1 },
      update: { count: { increment: 1 } },
      select: { count: true }
    });

    return {
      allowed: row.count <= limit,
      remaining: Math.max(0, limit - row.count),
      retryAfterSeconds
    };
  } catch {
    // Never let a limiter outage take down the endpoint it protects.
    return { allowed: true, remaining: limit, retryAfterSeconds };
  }
}

/** Best-effort client IP behind Vercel's proxy. */
export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Removes counters for windows that have already closed. */
export async function pruneRateLimits(olderThanHours = 24) {
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
  const { count } = await prisma.rateLimit.deleteMany({ where: { bucket: { lt: cutoff } } });
  return count;
}
