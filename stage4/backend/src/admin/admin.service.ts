import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../utils/http-error.js";
import type {
  UpdateAdminProfileInput,
  UpdateInstructorStatusInput,
} from "./admin.validation.js";

const adminProfileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

async function getDashboard() {
  const [
    totalUsers,
    totalCenters,
    pendingCenters,
    totalInstructors,
    pendingInstructors,
    totalBookings,
    confirmedBookings,
    totalReviews,
    revenue,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.divingCenter.count(),
    prisma.divingCenter.count({
      where: { status: "pending" },
    }),
    prisma.instructorProfile.count(),
    prisma.instructorProfile.count({
      where: { status: "pending" },
    }),
    prisma.booking.count(),
    prisma.booking.count({
      where: { status: "confirmed" },
    }),
    prisma.review.count(),
    prisma.booking.aggregate({
      where: { status: "confirmed" },
      _sum: { totalPrice: true },
    }),
  ]);

  return {
    totalUsers,
    totalCenters,
    pendingCenters,
    totalInstructors,
    pendingInstructors,
    totalBookings,
    confirmedBookings,
    totalReviews,
    totalRevenue: Number(revenue._sum.totalPrice ?? 0),
  };
}

async function getInstructors() {
  return prisma.instructorProfile.findMany({
    select: {
      id: true,
      licenseNumber: true,
      city: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function updateInstructorStatus(
  instructorProfileId: number,
  data: UpdateInstructorStatusInput,
) {
  try {
    return await prisma.instructorProfile.update({
      where: { id: instructorProfileId },
      data: { status: data.status },
      select: {
        id: true,
        licenseNumber: true,
        city: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new HttpError(404, "Instructor profile not found");
    }

    throw error;
  }
}

async function getProfile(userId: number) {
  const admin = await prisma.user.findFirst({
    where: {
      id: userId,
      role: "admin",
    },
    select: adminProfileSelect,
  });

  if (!admin) {
    throw new HttpError(404, "Admin profile not found");
  }

  return admin;
}

async function updateProfile(
  userId: number,
  data: UpdateAdminProfileInput,
) {
  await getProfile(userId);

  try {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: adminProfileSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new HttpError(409, "Email already exists");
    }

    throw error;
  }
}

export const adminService = {
  getDashboard,
  getInstructors,
  getProfile,
  updateInstructorStatus,
  updateProfile,
};
