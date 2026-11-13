import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelOrder } from "@/lib/stock";
import { isSameOriginRequest } from "@/lib/csrf";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId?: string }> }
) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json(
        { message: "Forbidden: invalid request origin." },
        { status: 403 }
      );
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 }
      );
    }

    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true },
    });

    if (!order || (user.role !== "ADMIN" && order.userId !== user.id)) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    let reason: string | undefined;

    try {
      const body: unknown = await request.json();

      if (
        typeof body === "object" &&
        body !== null &&
        "reason" in body &&
        typeof body.reason === "string"
      ) {
        reason = body.reason.trim().slice(0, 500);
      }
    } catch {
      // An empty request body is allowed.
    }

    const result = await cancelOrder(orderId, reason);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to cancel order.";

    console.error("Order cancellation failed:", error);

    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}