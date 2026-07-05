import "dotenv/config";
import { prisma } from "../src/prisma/client.js";

const passwordHash =
  "$2b$10$7EqJtq98hPqEX7fNZaFWoOHi6M6G5GeUXrXe3G5UpiRaY1oCbcn1K";

async function main() {
  const users = [
    {
      name: "Test User",
      email: "user@example.com",
      role: "user",
    },
    {
      name: "Test Instructor",
      email: "instructor@example.com",
      role: "instructor",
    },
    {
      name: "Test Diving Center",
      email: "divingcenter@example.com",
      role: "diving_center",
    },
    {
      name: "Test Admin",
      email: "admin@example.com",
      role: "admin",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
      },
    });
  }

  console.log("Development users created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });