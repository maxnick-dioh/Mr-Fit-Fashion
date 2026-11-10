import { NextResponse } from "next/server";
import { assertAuthConfigured, setSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("email" in body) ||
    typeof body.email !== "string" ||
    !("password" in body) ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const password = body.password;
  if (!email || email.length > 254 || !password || password.length > 128) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 400 });
  }

  try {
    assertAuthConfigured();
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        passwordHash: true,
        sessionVersion: true,
      },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { message: "Email or password is incorrect." },
        { status: 401 },
      );
    }

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
    return setSessionCookie(
      NextResponse.json({ user: safeUser }),
      user.id,
      user.sessionVersion,
    );
  } catch (error) {
    console.error("User login failed:", error);
    return NextResponse.json(
      { message: "Unable to sign in right now." },
      { status: 500 },
    );
  }
}
