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

 let confirmedBooking;

if (data.tripId) {
  confirmedBooking = await prisma.booking.findFirst({
    where: {
      userId,
      tripId: data.tripId,
      status: "confirmed",
    },
  });
} else if (data.courseId) {
  confirmedBooking = await prisma.booking.findFirst({
    where: {
      userId,
      courseId: data.courseId,
      status: "confirmed",
    },
  });
} else {
  confirmedBooking = await prisma.booking.findFirst({
    where: {
      userId,
      status: "confirmed",
      OR: [
        {
          trip: {
            is: {
              centerId: data.centerId,
            },
          },
        },
        {
          course: {
            is: {
              centerId: data.centerId,
            },
          },
        },
      ],
    },
  });
}

if (!confirmedBooking) {
  throw new Error(
    "You can only review an item that you have booked",
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
