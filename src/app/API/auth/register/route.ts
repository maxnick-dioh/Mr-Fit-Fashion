import { NextResponse } from "next/server";
import { assertAuthConfigured, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const registrationResponse = {
  message: "Continue to sign in. If you already have an account, use your existing password.",
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const fullName = "fullName" in body && typeof body.fullName === "string"
    ? body.fullName.trim()
    : "";
  const email = "email" in body && typeof body.email === "string"
    ? body.email.trim().toLowerCase()
    : "";
  const phone = "phone" in body && typeof body.phone === "string"
    ? body.phone.trim()
    : "";
  const password = "password" in body && typeof body.password === "string"
    ? body.password
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
