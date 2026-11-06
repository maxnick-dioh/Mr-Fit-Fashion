import { prisma } from "@/lib/prisma";

export async function reserveStock(orderItemId: string) {
  if (!orderItemId) {
    throw new Error("Order item ID is required.");
  }

  return prisma.$transaction(async (tx) => {
    const item = await tx.orderItem.findUnique({
      where: { id: orderItemId },
      select: {
        id: true,
        quantity: true,
        productId: true,
        variantId: true,
      },
    });

    if (!item) {
      throw new Error("Order item not found.");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Invalid order quantity.");
    }

    if (!item.variantId) {
      throw new Error("This order item has no stock variant.");
    }

    const variant = await tx.productVariant.findUnique({
      where: { id: item.variantId },
      select: { productId: true },
    });

    if (!variant || variant.productId !== item.productId) {
      throw new Error("Invalid product variant.");
    }

    const idempotencyKey = `reserve:${item.id}`;

    const existing = await tx.stockMovement.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      if (
        existing.type !== "RESERVED" ||
        existing.variantId !== item.variantId ||
        existing.quantity !== item.quantity
      ) {
        throw new Error("Conflicting stock reservation.");
      }

      return { success: true, alreadyReserved: true };
    }

    const updated = await tx.$executeRaw`
      UPDATE "ProductVariant"
      SET "reservedStock" = "reservedStock" + ${item.quantity}
      WHERE "id" = ${item.variantId}
      AND ("stock" - "reservedStock") >= ${item.quantity}
    `;

    if (updated !== 1) {
      throw new Error("Insufficient available stock.");
    }

    await tx.stockMovement.create({
      data: {
        variantId: item.variantId,
        orderItemId: item.id,
        type: "RESERVED",
        quantity: item.quantity,
        reason: "Order stock reservation",
        idempotencyKey,
      },
    });

    return { success: true, alreadyReserved: false };
  });
}

export async function releaseReservedStock(orderItemId: string) {
  if (!orderItemId) {
    throw new Error("Order item ID is required.");
  }

  return prisma.$transaction(async (tx) => {
    const item = await tx.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: {
          include: {
            payments: {
              where: { status: "SUCCEEDED" },
            },
          },
        },
      },
    });

    if (!item) {
      throw new Error("Order item not found.");
    }

    if (item.order.status !== "CANCELLED") {
      throw new Error("Only cancelled orders can release stock.");
    }

    if (item.order.payments.length > 0) {
      throw new Error(
        "This order has a successful payment. Use the paid-order fulfillment workflow."
      );
    }

    if (!item.variantId) {
      throw new Error("This order item has no stock variant.");
    }

    const releaseKey = `release:${item.id}`;
    const reserveKey = `reserve:${item.id}`;

    const existingRelease = await tx.stockMovement.findUnique({
      where: { idempotencyKey: releaseKey },
    });

    if (existingRelease) {
      return { success: true, alreadyReleased: true };
    }

    const reservation = await tx.stockMovement.findUnique({
      where: { idempotencyKey: reserveKey },
    });

    if (!reservation || reservation.type !== "RESERVED") {
      throw new Error("No valid stock reservation was found.");
    }

    if (
      reservation.variantId !== item.variantId ||
      reservation.quantity !== item.quantity
    ) {
      throw new Error("Stock reservation does not match this order item.");
    }

    const updated = await tx.$executeRaw`
      UPDATE "ProductVariant"
      SET "reservedStock" = "reservedStock" - ${item.quantity}
      WHERE "id" = ${item.variantId}
      AND "reservedStock" >= ${item.quantity}
    `;

    if (updated !== 1) {
      throw new Error("Unable to release reserved stock safely.");
    }

    await tx.stockMovement.create({
      data: {
        variantId: item.variantId,
        orderItemId: item.id,
        type: "RELEASED",
        quantity: item.quantity,
        reason: "Cancelled order stock release",
        idempotencyKey: releaseKey,
      },
    });

    return { success: true, alreadyReleased: false };
  });
}