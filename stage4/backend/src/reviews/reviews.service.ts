import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../utils/http-error.js";
import type { CreateReviewInput } from "./reviews.validation.js";

const reviewInclude = {
  user: {
    select: {
      id: true,
      name: true,
    },
  },
  center: true,
  trip: true,
  course: true,
} satisfies Prisma.ReviewInclude;

function confirmedBookingWhere(
  userId: number,
  review: CreateReviewInput,
): Prisma.BookingWhereInput {
  if (review.tripId !== undefined) {
    return {
      userId,
      tripId: review.tripId,
      status: "confirmed",
    };
  }

  if (review.courseId !== undefined) {
    return {
      userId,
      courseId: review.courseId,
      status: "confirmed",
    };
  }

  return {
    userId,
    status: "confirmed",
    OR: [
      {
        trip: {
          is: { centerId: review.centerId },
        },
      },
      {
        course: {
          is: { centerId: review.centerId },
        },
      },
    ],
  };
}

function existingReviewWhere(
  userId: number,
  review: CreateReviewInput,
): Prisma.ReviewWhereInput {
  if (review.tripId !== undefined) {
    return { userId, tripId: review.tripId };
  }

  if (review.courseId !== undefined) {
    return { userId, courseId: review.courseId };
  }

  return { userId, centerId: review.centerId };
}

async function create(userId: number, data: CreateReviewInput) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          const confirmedBooking = await transaction.booking.findFirst({
            where: confirmedBookingWhere(userId, data),
            select: { id: true },
          });

          if (!confirmedBooking) {
            throw new HttpError(
              403,
              "You can only review an item that you have booked",
            );
          }

          const existingReview = await transaction.review.findFirst({
            where: existingReviewWhere(userId, data),
            select: { id: true },
          });

          if (existingReview) {
            throw new HttpError(
              409,
              "You have already reviewed this item",
            );
          }

          return transaction.review.create({
            data: {
              userId,
              centerId: data.centerId,
              tripId: data.tripId,
              courseId: data.courseId,
              rating: data.rating,
              comment: data.comment,
            },
            include: reviewInclude,
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      const isWriteConflict =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034";

      if (isWriteConflict && attempt < maxAttempts) continue;

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new HttpError(409, "You have already reviewed this item");
      }

      if (isWriteConflict) {
        throw new HttpError(
          409,
          "Review submission conflicted with another request. Please retry.",
        );
      }

      throw error;
    }
  }

  throw new HttpError(409, "Unable to submit review. Please retry.");
}

async function getAll() {
  return prisma.review.findMany({
    include: reviewInclude,
    orderBy: { createdAt: "desc" },
  });
}

async function getByCenter(centerId: number) {
  return prisma.review.findMany({
    where: { centerId },
    include: reviewInclude,
    orderBy: { createdAt: "desc" },
  });
}

async function getByTrip(tripId: number) {
  return prisma.review.findMany({
    where: { tripId },
    include: reviewInclude,
    orderBy: { createdAt: "desc" },
  });
}

async function getByCourse(courseId: number) {
  return prisma.review.findMany({
    where: { courseId },
    include: reviewInclude,
    orderBy: { createdAt: "desc" },
  });
}

async function deleteReview(id: number) {
  const existingReview = await prisma.review.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingReview) {
    throw new HttpError(404, "Review not found");
  }

  return prisma.review.delete({ where: { id } });
}

export const reviewsService = {
  create,
  getAll,
  getByCenter,
  getByTrip,
  getByCourse,
  delete: deleteReview,
};
