import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  throw new Error("Provide the registered account email.");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured.");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function promoteAdmin() {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new Error("No account found with that email.");
    }

    if (user.role === "ADMIN") {
      console.log("This account is already an administrator.");
      return;
    }

    const result = await prisma.user.updateMany({
      where: {
        id: user.id,
        role: "CUSTOMER",
      },
      data: {
        role: "ADMIN",
        sessionVersion: { increment: 1 },
      },
    });

    if (result.count !== 1) {
      throw new Error("Promotion failed. Account status may have changed.");
    }

    console.log(`Administrator access granted to ${user.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

promoteAdmin().catch((error) => {
  console.error("Admin promotion failed:", error.message);
  process.exitCode = 1;
});