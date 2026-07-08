import { prisma } from "../lib/prisma.js";
import type { CreateReviewInput } from "./reviews.validation.js";

export async function createReview(userId: number, input: CreateReviewInput) {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
  });

  if (!booking) {
    throw { status: 404, message: "Booking not found" };
  }

  if (booking.userId !== userId) {
    throw { status: 403, message: "Forbidden" };
  }

  if (booking.status !== "COMPLETED") {
    throw { status: 400, message: "You can only review completed stays" };
  }

  const existing = await prisma.review.findUnique({
    where: { bookingId: input.bookingId },
  });

  if (existing) {
    throw { status: 409, message: "Review already exists for this booking" };
  }

  return prisma.review.create({
    data: {
      bookingId: input.bookingId,
      userId,
      listingId: booking.listingId,
      rating: input.rating,
      comment: input.comment,
    },
  });
}

export async function getListingReviews(listingId: number) {
  return prisma.review.findMany({
    where: { listingId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}
