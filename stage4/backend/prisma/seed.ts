/**
 * Development password for all seeded users:
 * Password123!
 */

import "dotenv/config";
import { prisma } from "../src/prisma/client.js";
import bcrypt from "bcryptjs";

async function main() {
  const password = "Password123!";
  const passwordHash = await bcrypt.hash(password, 10);

  // =====================
  // 1. Seed Users
  // =====================
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@example.com",
      passwordHash,
      role: "user",
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@example.com" },
    update: {},
    create: {
      name: "Test Instructor",
      email: "instructor@example.com",
      passwordHash,
      role: "instructor",
    },
  });

  const centerOwner = await prisma.user.upsert({
    where: { email: "divingcenter@example.com" },
    update: {},
    create: {
      name: "Test Diving Center",
      email: "divingcenter@example.com",
      passwordHash,
      role: "diving_center",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Test Admin",
      email: "admin@example.com",
      passwordHash,
      role: "admin",
    },
  });

  console.log("Development users created successfully.");

  // =====================
  // 2. Seed Diving Center
  // =====================
  const center = await prisma.divingCenter.upsert({
    where: { licenseNumber: "LIC-2026-001" },
    update: {},
    create: {
      name: "Red Sea Diving Center",
      city: "Jeddah",
      address: "Corniche Road, Jeddah",
      licenseNumber: "LIC-2026-001",
      description: "A leading diving center offering Red Sea reef trips and courses.",
      priceRange: "300-600 SAR",
      contactEmail: "info@redsea.sa",
      contactPhone: "+966500000000",
      status: "approved",
      ownerId: centerOwner.id,
    },
  });

  console.log("Diving center created successfully.");

  // =====================
  // 3. Seed Trip
  // =====================
  await prisma.trip.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Coral Reef Discovery Dive",
      description: "A guided dive exploring the vibrant coral reefs of the Red Sea.",
      durationHours: 3,
      difficultyLevel: "beginner",
      pricePerPerson: 350.0,
      maxCapacity: 10,
      scheduleDate: new Date("2026-08-15"),
      status: "approved",
      centerId: center.id,
      instructorId: instructor.id,
    },
  });

  console.log("Trip created successfully.");

  // =====================
  // 4. Seed Course
  // =====================
  await prisma.course.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "PADI Open Water Diver",
      description: "Beginner certification course covering diving fundamentals and safety.",
      level: "beginner",
      price: 1800.0,
      startDate: new Date("2026-08-20"),
      status: "approved",
      centerId: center.id,
      instructorId: instructor.id,
    },
  });

  console.log("Course created successfully.");
  console.log("All seed data created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });