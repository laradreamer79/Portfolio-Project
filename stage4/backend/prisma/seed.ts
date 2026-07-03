import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed_password",
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