import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../utils/http-error.js";
import type { UpdateInstructorProfileInput } from "./instructors.validation.js";

const instructorProfileSelect = {
  licenseNumber: true,
  city: true,
  status: true,
} satisfies Prisma.InstructorProfileSelect;

async function getMine(userId: number) {
  const profile = await prisma.instructorProfile.findUnique({
    where: { userId },
    select: instructorProfileSelect,
  });

  if (!profile) {
    throw new HttpError(404, "Instructor profile not found");
  }

  return profile;
}

async function updateMine(
  userId: number,
  data: UpdateInstructorProfileInput,
) {
  try {
    return await prisma.instructorProfile.update({
      where: { userId },
      data,
      select: instructorProfileSelect,
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

export const instructorsService = {
  getMine,
  updateMine,
};
