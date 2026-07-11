import { prisma } from "../prisma/client.js";

export async function createReview(
  userId: number,
  data: any,
) {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const existingReview =
    await prisma.review.findFirst({
      where: {
        userId,
        centerId: data.centerId,
      },
    });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this center",
    );
  }

  return prisma.review.create({
    data: {
      userId,
      centerId: data.centerId,
      tripId: data.tripId,
      courseId: data.courseId,
      rating: data.rating,
      comment: data.comment,
    },

    include: {
      user: true,
      center: true,
      trip: true,
      course: true,
    },
  });
}

export async function getReviews(
  centerId: number,
) {
  return prisma.review.findMany({
    where: {
      centerId,
    },

    include: {
      user: true,
      center: true,
      trip: true,
      course: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}
