/**
 * Development password for all seeded users:
 * 123456
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/prisma/client.js";

type CenterSeed = {
  ownerName: string;
  ownerEmail: string;
  center: {
    name: string;
    city: string;
    address: string;
    licenseNumber: string;
    description: string;
    priceRange: string;
    contactEmail: string;
    contactPhone: string;
    imageUrl: string;
  };
  trip: {
    title: string;
    description: string;
    durationHours: number;
    difficultyLevel: "beginner" | "intermediate" | "advanced";
    pricePerPerson: number;
    maxCapacity: number;
    scheduleDate: Date;
    imageUrl: string;
  };
  course: {
    title: string;
    description: string;
    level: string;
    price: number;
    startDate: Date;
    imageUrl: string;
  };
};

const centerSeeds: CenterSeed[] = [
  {
    ownerName: "Red Sea Diving Center",
    ownerEmail: "divingcenter@example.com",
    center: {
      name: "Red Sea Diving Center",
      city: "Jeddah",
      address: "Corniche Road, Jeddah",
      licenseNumber: "LIC-2026-001",
      description:
        "A professional Jeddah diving center offering guided Red Sea reef dives, beginner-friendly boat trips, and certification courses along the coast.",
      priceRange: "300-600 SAR",
      contactEmail: "info@redsea.sa",
      contactPhone: "+966500000000",
      imageUrl:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    },
    trip: {
      title: "Coral Reef Discovery Dive",
      description:
        "A guided morning dive for new and returning divers exploring shallow coral gardens near Jeddah with calm conditions and colorful reef life.",
      durationHours: 3,
      difficultyLevel: "beginner",
      pricePerPerson: 350,
      maxCapacity: 10,
      scheduleDate: new Date("2026-08-15T09:00:00.000Z"),
      imageUrl:
        "https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=1200&q=80",
    },
    course: {
      title: "PADI Open Water Diver",
      description:
        "A full beginner certification course covering safety, buoyancy, equipment setup, confined-water practice, and supervised open-water dives.",
      level: "beginner",
      price: 1800,
      startDate: new Date("2026-08-20T09:00:00.000Z"),
      imageUrl:
        "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    ownerName: "Blue Pearl Diving Center",
    ownerEmail: "bluepearl@example.com",
    center: {
      name: "Blue Pearl Diving Center",
      city: "Yanbu",
      address: "Royal Commission Waterfront, Yanbu",
      licenseNumber: "LIC-2026-002",
      description:
        "A Yanbu-based diving center known for clear-water reef dives, relaxed boat schedules, and small-group training around the northern Red Sea.",
      priceRange: "350-750 SAR",
      contactEmail: "hello@bluepearl.sa",
      contactPhone: "+966500000002",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    },
    trip: {
      title: "Seven Sisters Reef Boat Dive",
      description:
        "A boat dive to Yanbu reef sites with excellent visibility, soft coral formations, and a route planned for intermediate recreational divers.",
      durationHours: 4,
      difficultyLevel: "intermediate",
      pricePerPerson: 450,
      maxCapacity: 8,
      scheduleDate: new Date("2026-08-22T08:30:00.000Z"),
      imageUrl:
        "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80",
    },
    course: {
      title: "Advanced Buoyancy Workshop",
      description:
        "A focused skills course helping certified divers improve trim, buoyancy control, finning technique, and air consumption.",
      level: "intermediate",
      price: 950,
      startDate: new Date("2026-08-25T10:00:00.000Z"),
      imageUrl:
        "https://images.unsplash.com/photo-1526248814268-c4e3e450a4d6?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    ownerName: "Farasan Reef Divers",
    ownerEmail: "farasanreef@example.com",
    center: {
      name: "Farasan Reef Divers",
      city: "Jazan",
      address: "Farasan Ferry Marina, Jazan",
      licenseNumber: "LIC-2026-003",
      description:
        "A Jazan diving team specializing in Farasan Islands trips, reef conservation awareness, and warm-water dives for confident beginners.",
      priceRange: "400-850 SAR",
      contactEmail: "bookings@farasanreef.sa",
      contactPhone: "+966500000003",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    },
    trip: {
      title: "Farasan Islands Reef Safari",
      description:
        "A day trip by boat to Farasan reef sites with briefing, guided dives, surface interval support, and time to enjoy the island scenery.",
      durationHours: 6,
      difficultyLevel: "intermediate",
      pricePerPerson: 650,
      maxCapacity: 6,
      scheduleDate: new Date("2026-09-03T07:30:00.000Z"),
      imageUrl:
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
    },
    course: {
      title: "Reef Awareness Specialty",
      description:
        "A conservation-focused course teaching reef-safe diving habits, marine-life awareness, and careful underwater navigation.",
      level: "beginner",
      price: 700,
      startDate: new Date("2026-09-05T09:00:00.000Z"),
      imageUrl:
        "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    ownerName: "Half Moon Dive Club",
    ownerEmail: "halfmoondive@example.com",
    center: {
      name: "Half Moon Dive Club",
      city: "Al Khobar",
      address: "Half Moon Bay, Al Khobar",
      licenseNumber: "LIC-2026-004",
      description:
        "An Eastern Province dive club offering weekend training, pool refreshers, and coastal dive programs for divers near Al Khobar.",
      priceRange: "250-700 SAR",
      contactEmail: "team@halfmoondive.sa",
      contactPhone: "+966500000004",
      imageUrl:
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    },
    trip: {
      title: "Half Moon Bay Skills Dive",
      description:
        "A relaxed coastal dive focused on confidence building, buddy checks, controlled descents, and underwater communication practice.",
      durationHours: 3,
      difficultyLevel: "beginner",
      pricePerPerson: 280,
      maxCapacity: 12,
      scheduleDate: new Date("2026-09-10T14:00:00.000Z"),
      imageUrl:
        "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=1200&q=80",
    },
    course: {
      title: "Rescue Diver Preparation",
      description:
        "A practical preparation course covering self-rescue awareness, assisting tired divers, emergency planning, and rescue scenarios.",
      level: "advanced",
      price: 1400,
      startDate: new Date("2026-09-12T09:00:00.000Z"),
      imageUrl:
        "https://images.unsplash.com/photo-1526934969114-45fb5b164b7b?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    ownerName: "Umluj Lagoon Divers",
    ownerEmail: "umlujlagoon@example.com",
    center: {
      name: "Umluj Lagoon Divers",
      city: "Umluj",
      address: "Umluj Harbor, Umluj",
      licenseNumber: "LIC-2026-005",
      description:
        "A boutique Umluj dive operator offering small-group lagoon dives, calm-water discovery trips, and scenic training experiences.",
      priceRange: "450-900 SAR",
      contactEmail: "dive@umlujlagoon.sa",
      contactPhone: "+966500000005",
      imageUrl:
        "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
    },
    trip: {
      title: "Umluj Lagoon Discovery Dive",
      description:
        "A scenic lagoon dive designed for calm conditions, shallow reef exploration, and a relaxed introduction to Umluj underwater life.",
      durationHours: 4,
      difficultyLevel: "beginner",
      pricePerPerson: 520,
      maxCapacity: 7,
      scheduleDate: new Date("2026-09-18T08:00:00.000Z"),
      imageUrl:
        "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=80",
    },
    course: {
      title: "Discover Scuba Experience",
      description:
        "A supervised introductory scuba experience including equipment orientation, shallow-water practice, and a guided lagoon dive.",
      level: "beginner",
      price: 850,
      startDate: new Date("2026-09-20T10:00:00.000Z"),
      imageUrl:
        "https://images.unsplash.com/photo-1544551763-92ab472cad5d?auto=format&fit=crop&w=1200&q=80",
    },
  },
];

async function upsertTrip(centerId: number, trip: CenterSeed["trip"]) {
  const existingTrip = await prisma.trip.findFirst({
    where: { title: trip.title, centerId },
  });

  const data = {
    ...trip,
    status: "approved" as const,
    centerId,
    instructorId: null,
  };

  if (existingTrip) {
    return prisma.trip.update({
      where: { id: existingTrip.id },
      data,
    });
  }

  return prisma.trip.create({ data });
}

async function upsertCourse(centerId: number, course: CenterSeed["course"]) {
  const existingCourse = await prisma.course.findFirst({
    where: { title: course.title, centerId },
  });

  const data = {
    ...course,
    status: "approved" as const,
    centerId,
    instructorId: null,
  };

  if (existingCourse) {
    return prisma.course.update({
      where: { id: existingCourse.id },
      data,
    });
  }

  return prisma.course.create({ data });
}

async function main() {
  const password = "123456";
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: { passwordHash },
    create: {
      name: "Test User",
      email: "user@example.com",
      passwordHash,
      role: "user",
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@example.com" },
    update: { passwordHash },
    create: {
      name: "Test Instructor",
      email: "instructor@example.com",
      passwordHash,
      role: "instructor",
    },
  });

  await prisma.instructorProfile.upsert({
    where: { userId: instructor.id },
    update: {
      licenseNumber: "INST-2026-001",
      status: "approved",
    },
    create: {
      licenseNumber: "INST-2026-001",
      status: "approved",
      userId: instructor.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { passwordHash },
    create: {
      name: "Test Admin",
      email: "admin@example.com",
      passwordHash,
      role: "admin",
    },
  });

  console.log(`Development user created: ${user.email}`);
  console.log(`Development instructor created: ${instructor.email}`);
  console.log("Development admin created: admin@example.com");

  for (const seed of centerSeeds) {
    const owner = await prisma.user.upsert({
      where: { email: seed.ownerEmail },
      update: {
        name: seed.ownerName,
        passwordHash,
        role: "diving_center",
      },
      create: {
        name: seed.ownerName,
        email: seed.ownerEmail,
        passwordHash,
        role: "diving_center",
      },
    });

    const center = await prisma.divingCenter.upsert({
      where: { licenseNumber: seed.center.licenseNumber },
      update: {
        ...seed.center,
        status: "approved",
        ownerId: owner.id,
      },
      create: {
        ...seed.center,
        status: "approved",
        ownerId: owner.id,
      },
    });

    await upsertTrip(center.id, seed.trip);
    await upsertCourse(center.id, seed.course);

    console.log(
      `Seeded ${center.name} in ${center.city} with one trip and one course.`,
    );
  }

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
