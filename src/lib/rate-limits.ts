import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();

// Maximum 10 login requests per IP every 15 minutes.
const ipLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  prefix: "mrfits:login:ip",
});

// Maximum 5 login requests per email + IP every 15 minutes.
const accountLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "mrfits:login:account",
});

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export async function checkLoginRateLimit(
  request: Request,
  email: string,
) {
  const ip = getClientIp(request);

  // Hash the email/IP combination before using it as a Redis key.
  const accountKey = createHash("sha256")
    .update(`${email.toLowerCase()}:${ip}`)
    .digest("hex");

  const [ipResult, accountResult] = await Promise.all([
    ipLimiter.limit(ip),
    accountLimiter.limit(accountKey),
  ]);

  return {
    success: ipResult.success && accountResult.success,
    remaining: Math.min(
      ipResult.remaining,
      accountResult.remaining,
    ),
    reset: Math.max(ipResult.reset, accountResult.reset),
  };
}