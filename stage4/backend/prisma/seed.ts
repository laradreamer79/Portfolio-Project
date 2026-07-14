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
    address: string | null;
    licenseNumber: string;
    description: string | null;
    priceRange: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    imageUrl: string | null;
    status: "pending" | "approved" | "rejected";
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
    status: "pending" | "approved" | "rejected";
  };
  course: {
    title: string;
    description: string;
    level: string;
    price: number;
    startDate: Date;
    imageUrl: string;
    status: "pending" | "approved" | "rejected";
  };
};

const centerSeeds: CenterSeed[] = [
  {
    ownerName: "Ahmed Alharbi",
    ownerEmail: "ahmed.alharbi@redseadivers.com",
    center: {
      name: "Red Sea Divers",
      city: "Jeddah",
      address: null,
      licenseNumber: "JED-RSD-001",
      description: null,
      priceRange: null,
      contactEmail: "ahmed.alharbi@redseadivers.com",
      contactPhone: null,
      imageUrl: null,
      status: "pending",
    },
    trip: {
      title: "Red Sea Coral Reef Dive",
      description:
        "Enjoy a guided diving trip in the Red Sea and discover colorful coral reefs, tropical fish, and crystal-clear waters. This trip is suitable for certified Open Water divers and offers a safe and unforgettable diving experience.",
      durationHours: 8,
      difficultyLevel: "beginner",
      pricePerPerson: 350,
      maxCapacity: 10,
      scheduleDate: new Date("2026-08-20T00:00:00.000Z"),
      imageUrl:
        "https://res.cloudinary.com/btg0wl3f/image/upload/v1783959710/oyster/trips/kqmx0yyjuk770obonaph.jpg",
      status: "approved",
    },
    course: {
      title: "Open Water Diver Certification",
      description:
        "Learn the fundamentals of scuba diving with certified instructors in the Red Sea. This Open Water Diver course includes classroom sessions, confined water practice, and open water dives, leading to an internationally recognized certification.",
      level: "Open Water",
      price: 1800,
      startDate: new Date("2026-08-30T00:00:00.000Z"),
      imageUrl:
        "https://res.cloudinary.com/btg0wl3f/image/upload/v1783961691/oyster/courses/qwz1w1n3wqu1orvbxak1.jpg",
      status: "approved",
    },
  },
  {
    ownerName: "Mohammed Nasser",
    ownerEmail: "mohammed.nasser@divebubbles.sa",
    center: {
      name: "Aqua Arabia Diving",
      city: "Al Khobar",
      address: null,
      licenseNumber: "KHB-AAD-002",
      description: null,
      priceRange: null,
      contactEmail: "mohammed.nasser@divebubbles.sa",
      contactPhone: null,
      imageUrl: null,
      status: "pending",
    },
    trip: {
      title: "Half Moon Bay Reef Dive",
      description:
        "Explore the beautiful reefs of Half Moon Bay in Al Khobar with experienced dive guides. This full-day diving trip offers excellent visibility, diverse marine life, and an unforgettable underwater adventure for certified divers.",
      durationHours: 8,
      difficultyLevel: "beginner",
      pricePerPerson: 450,
      maxCapacity: 8,
      scheduleDate: new Date("2026-08-27T00:00:00.000Z"),
      imageUrl:
        "https://res.cloudinary.com/btg0wl3f/image/upload/v1783964385/oyster/trips/hitv7nsqtbgevokmooyd.jpg",
      status: "approved",
    },
    course: {
      title: "Advanced Nitrox Course",
      description:
        "Develop advanced diving skills while learning how to safely use enriched air nitrox. This course covers dive planning, gas management, and practical underwater training with certified instructors.",
      level: "Open Water",
      price: 2200,
      startDate: new Date("2026-08-16T00:00:00.000Z"),
      imageUrl:
        "https://res.cloudinary.com/btg0wl3f/image/upload/v1783964918/oyster/courses/qsconsfc7p8ywe8ayxbd.jpg",
      status: "approved",
    },
  },
  {
    ownerName: "Omar Khaled",
    ownerEmail: "omar.khaled@yanbudivingclub.sa",
    center: {
      name: "Yanbu Diving Club",
      city: "Yanbu",
      address: null,
      licenseNumber: "YNB-YDC-003",
      description: null,
      priceRange: null,
      contactEmail: "omar.khaled@yanbudivingclub.sa",
      contactPhone: null,
      imageUrl: null,
      status: "pending",
    },
    trip: {
      title: "Seven Sisters Reef Dive",
      description:
        "Dive into the famous Seven Sisters Reef in Yanbu and discover vibrant coral reefs, crystal-clear waters, and diverse marine life. This guided diving trip is designed for certified divers seeking an exciting Red Sea adventure.",
      durationHours: 8,
      difficultyLevel: "beginner",
      pricePerPerson: 400,
      maxCapacity: 10,
      scheduleDate: new Date("2026-08-29T00:00:00.000Z"),
      imageUrl:
        "https://res.cloudinary.com/btg0wl3f/image/upload/v1783965749/oyster/trips/lstntlosbzitcj24elro.jpg",
      status: "approved",
    },
    course: {
      title: "Discover Scuba Diving",
      description:
        "Experience your first underwater adventure with professional instructors. This introductory course teaches basic scuba skills and allows beginners to safely explore the underwater world without prior diving experience.",
      level: "Beginner",
      price: 950,
      startDate: new Date("2026-08-27T00:00:00.000Z"),
      imageUrl:
        "https://res.cloudinary.com/btg0wl3f/image/upload/v1783965936/oyster/courses/hmlnbjzhporxjfekiuc9.jpg",
      status: "approved",
    },
  },
  {
    ownerName: "Faisal Abdullah",
    ownerEmail: "faisal.abdullah@gulfdivers.sa",
    center: {
      name: "Gulf Divers Dammam",
      city: "Dammam",
      address: null,
      licenseNumber: "DMM-GDD-004",
      description: null,
      priceRange: null,
      contactEmail: "faisal.abdullah@gulfdivers.sa",
      contactPhone: null,
      imageUrl: null,
      status: "pending",
    },
    trip: {
      title: "Arabian Gulf Reef Dive",
      description:
        "Explore the underwater beauty of the Arabian Gulf with a guided reef diving experience. Discover colorful marine life, healthy coral formations, and enjoy a safe diving adventure with certified instructors.",
      durationHours: 8,
      difficultyLevel: "beginner",
      pricePerPerson: 300,
      maxCapacity: 10,
      scheduleDate: new Date("2026-08-15T00:00:00.000Z"),
      imageUrl:
        "https://res.cloudinary.com/btg0wl3f/image/upload/v1783967025/oyster/trips/xm4c6vtlyixjdbrwp2ld.jpg",
      status: "approved",
    },
    course: {
      title: "PADI Open Water Course",
      description:
        "Learn the fundamentals of scuba diving through classroom sessions, confined water training, and open water dives. This internationally recognized course prepares beginners to become certified Open Water Divers.",
      level: "Open Water",
      price: 1800,
      startDate: new Date("2026-07-13T00:00:00.000Z"),
      imageUrl:
        "https://res.cloudinary.com/btg0wl3f/image/upload/v1783967218/oyster/courses/jnm8nw8v0vwysnsy7xxv.jpg",
      status: "approved",
    },
  },
  {
    ownerName: "Khalid Ibrahim",
    ownerEmail: "khalid.ibrahim@bluedivingneom.sa",
    center: {
      name: "Blue Diving NEOM",
      city: "NEOM",
      address: null,
      licenseNumber: "NEM-BDN-005",
      description: null,
      priceRange: null,
      contactEmail: "khalid.ibrahim@bluedivingneom.sa",
      contactPhone: null,
      imageUrl: null,
      status: "pending",
    },
    trip: {
      title: "NEOM Coastal Reef Dive",
      description:
        "Explore the untouched reefs of NEOM's coastline and experience crystal-clear waters, diverse marine life, and breathtaking underwater landscapes. This guided diving trip is designed for certified divers seeking a premium Red Sea adventure.",
      durationHours: 8,
      difficultyLevel: "beginner",
      pricePerPerson: 550,
      maxCapacity: 8,
      scheduleDate: new Date("2026-08-31T00:00:00.000Z"),
      imageUrl:
        "https://res.cloudinary.com/btg0wl3f/image/upload/v1783967806/oyster/trips/hqbfjgy9luanywzzdusf.jpg",
      status: "approved",
    },
    course: {
      title: "Discover Scuba Diving",
      description:
        "Experience your first scuba dive with professional instructors in the pristine waters of NEOM. This beginner-friendly course introduces essential diving skills, safety procedures, and underwater exploration without requiring previous diving experience.",
      level: "Beginner",
      price: 950,
      startDate: new Date("2026-07-13T00:00:00.000Z"),
      imageUrl:
        "https://res.cloudinary.com/btg0wl3f/image/upload/v1783967940/oyster/courses/rijzemiazybmdqs5tujn.jpg",
      status: "approved",
    },
  },
];

async function upsertTrip(centerId: number, trip: CenterSeed["trip"]) {
  const existingTrip = await prisma.trip.findFirst({
    where: { title: trip.title, centerId },
  });

  const data = {
    ...trip,
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
        ownerId: owner.id,
      },
      create: {
        ...seed.center,
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
