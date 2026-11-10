import { NextResponse } from "next/server";
import { clearSessionCookie, revokeCurrentSession } from "@/lib/auth";

export async function POST() {
  try {
    await revokeCurrentSession();
    return clearSessionCookie(NextResponse.json({ success: true }));
  } catch (error) {
    console.error("Session revocation failed:", error);
    return clearSessionCookie(
      NextResponse.json(
        { message: "Unable to revoke this session. Please try again." },
        { status: 500 },
      ),
    );
  }
}
