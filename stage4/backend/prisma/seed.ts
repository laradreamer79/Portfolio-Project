import "dotenv/config";
import { prisma } from "../src/prisma/client.js";

const passwordHash =
  "$2b$10$7EqJtq98hPqEX7fNZaFWoOHi6M6G5GeUXrXe3G5UpiRaY1oCbcn1K";

async function main() {
  await prisma.user.upsert({
    where: {
      email: "test@example.com",
    },
    update: {},
    create: {
      name: "Test User",
      email: "test@example.com",
      passwordHash,
      role: "user",
    },
  });

  console.log("Test user created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });