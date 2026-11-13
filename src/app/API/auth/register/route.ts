import { NextResponse } from "next/server";
import { assertAuthConfigured, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSameOriginRequest } from "@/lib/csrf";
const registrationResponse = {
  message: "Continue to sign in. If you already have an account, use your existing password.",
};

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (
  typeof body !== "object" ||
  body === null ||
  Array.isArray(body)
) {
  return NextResponse.json(
    { message: "Request body must be a JSON object." },
    { status: 400 }
  );
}

const data = body as Record<string, unknown>;

  const fullName =
  typeof data.fullName === "string"
    ? data.fullName.trim()
    : "";

const email =
  typeof data.email === "string"
    ? data.email.trim().toLowerCase()
    : "";

const phone =
  typeof data.phone === "string" || typeof data.phone === "number"
    ? String(data.phone).trim()
    : "";

const password =
  typeof data.password === "string"
    ? data.password
    : "";

  if (
    fullName.length < 2 ||
    fullName.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    phone.length > 30 ||
    password.length < 12 ||
    password.length > 128
  ) {
    return NextResponse.json(
      { message: "Enter a valid name and email, and use a password of 12 to 128 characters." },
      { status: 400 },
    );
  }

  try {
    assertAuthConfigured();
    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        passwordHash,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json(registrationResponse, { status: 202 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(registrationResponse, { status: 202 });
    }

    console.error("User registration failed:", error);
    return NextResponse.json(
      { message: "Unable to create your account right now." },
      { status: 500 },
    );
  }
}
