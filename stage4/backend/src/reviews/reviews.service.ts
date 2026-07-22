import { prisma } from "../prisma/client.js";

export async function createReview(
  userId: number,
  data: any,
) {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }


  if (
    Number(!!data.centerId) +
      Number(!!data.tripId) +
      Number(!!data.courseId) !==
    1
  ) {
    throw new Error(
      "Review must be for exactly one item",
    );
  }

  let existingReview;

  if (data.tripId) {
    existingReview =
      await prisma.review.findFirst({
        where: {
          userId,
          tripId: data.tripId,
        },
      });
  } else if (data.courseId) {
    existingReview =
      await prisma.review.findFirst({
        where: {
          userId,
          courseId: data.courseId,
        },
      });
  } else {
    existingReview =
      await prisma.review.findFirst({
        where: {
          userId,
          centerId: data.centerId,
        },
      });
  }

  if (existingReview) {
    throw new Error(
      "You have already reviewed this item",
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

const reviewInclude = {
  user: true,
  center: true,
  trip: true,
  course: true,
};

export async function getCenterReviews(
  centerId: number,
) {
  return prisma.review.findMany({
    where: {
      centerId,
    },
    include: reviewInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAllReviews() {
  return prisma.review.findMany({
    include: reviewInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTripReviews(
  tripId: number,
) {
  return prisma.review.findMany({
    where: {
      tripId,
    },
    include: reviewInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCourseReviews(
  courseId: number,
) {
  return prisma.review.findMany({
    where: {
      courseId,
    },
    include: reviewInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteReview(id: number) {
  const existingReview = await prisma.review.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  return prisma.review.delete({
    where: { id },
  });
}
