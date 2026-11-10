import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "mrfits_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const PASSWORD_HASH_BYTES = 64;

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("AUTH_SECRET must be set to a random value of at least 32 bytes.");
  }
  return secret;
}

export function assertAuthConfigured() {
  getAuthSecret();
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(password, salt, PASSWORD_HASH_BYTES)) as Buffer;
  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, encodedHash, extra] = storedHash.split("$");
  if (
    algorithm !== "scrypt" ||
    !salt ||
    !/^[a-f0-9]{32}$/i.test(salt) ||
    !encodedHash ||
    !/^[a-f0-9]{128}$/i.test(encodedHash) ||
    extra !== undefined
  ) {
    return false;
  }

  const expected = Buffer.from(encodedHash, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return timingSafeEqual(actual, expected);
}

function signSessionPayload(payload: string) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

export function createSessionToken(userId: string, sessionVersion: number) {
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      ver: sessionVersion,
      exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    }),
  ).toString("base64url");

  return `${payload}.${signSessionPayload(payload)}`;
}

export function readSessionToken(token: string | undefined) {
  if (!token) return null;

  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra !== undefined) return null;

    const expected = Buffer.from(signSessionPayload(payload), "base64url");
    const actual = Buffer.from(signature, "base64url");
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      return null;
    }

    const data: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      typeof data !== "object" ||
      data === null ||
      !("sub" in data) ||
      typeof data.sub !== "string" ||
      !data.sub ||
      !("exp" in data) ||
      typeof data.exp !== "number" ||
      data.exp <= Math.floor(Date.now() / 1000) ||
      !("ver" in data) ||
      typeof data.ver !== "number" ||
      !Number.isInteger(data.ver) ||
      data.ver < 0
    ) {
      return null;
    }

    return { userId: data.sub, sessionVersion: data.ver };
  } catch {
    return null;
  }
}

export function setSessionCookie(
  response: Response,
  userId: string,
  sessionVersion: number,
) {
  const token = createSessionToken(userId, sessionVersion);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION_SECONDS}${secure}`,
  );
  return response;
}

export function clearSessionCookie(response: Response) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
  );
  return response;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  assertAuthConfigured();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = readSessionToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      sessionVersion: true,
    },
  });

  if (!user || user.sessionVersion !== session.sessionVersion) return null;

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function revokeCurrentSession() {
  assertAuthConfigured();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = readSessionToken(token);
  if (!session) return;

  await prisma.user.updateMany({
    where: {
      id: session.userId,
      sessionVersion: session.sessionVersion,
    },
    data: { sessionVersion: { increment: 1 } },
  });
}
