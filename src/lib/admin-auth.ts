import { NextResponse } from "next/server";
import { getCurrentUser, type AuthUser } from "@/lib/auth";

type AdminAuthResult =
  | { authorized: true; user: AuthUser }
  | { authorized: false; response: NextResponse };

export async function requireAdmin(): Promise<AdminAuthResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      ),
    };
  }

  if (user.role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json(
        { message: "You are not authorized to perform this action." },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user,
  };
}