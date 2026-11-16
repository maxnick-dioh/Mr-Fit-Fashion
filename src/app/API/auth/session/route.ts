import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Not signed in." }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Unable to read the current session:", error);
    return NextResponse.json(
      { message: "Unable to read the current session." },
      { status: 500 },
    );
  }
}
