import { prisma } from "../lib/prisma.js";
import type { CreateBookingInput } from "./bookings.validation.js";

export async function checkAvailability(
  listingId: number,
  checkIn: Date,
  checkOut: Date,
  excludeBookingId?: number,
) {
  const overlapping = await prisma.booking.findFirst({
    where: {
      listingId,
      status: { not: "CANCELLED" },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
      AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
    },
  });

  return !overlapping;
}

export async function createBooking(userId: number, input: CreateBookingInput) {
  const checkIn = new Date(input.checkIn);
  const checkOut = new Date(input.checkOut);

  const listing = await prisma.listing.findUnique({
    where: { id: input.listingId },
  });

  if (!listing) {
    throw { status: 404, message: "Listing not found" };
  }

  const isAvailable = await checkAvailability(input.listingId, checkIn, checkOut);

  if (!isAvailable) {
    throw { status: 409, message: "Listing is not available for the selected dates" };
  }

  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
  );
  const totalPrice = nights * listing.pricePerNight;

  return prisma.booking.create({
    data: {
      userId,
      listingId: input.listingId,
      checkIn,
      checkOut,
      totalPrice,
      status: "CONFIRMED",
    },
  });
}

export async function cancelBooking(
  userId: number,
  role: string,
  bookingId: number,
) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking) {
    throw { status: 404, message: "Booking not found" };
  }

  if (booking.userId !== userId && role !== "ADMIN") {
    throw { status: 403, message: "Forbidden" };
  }

  if (booking.status === "CANCELLED") {
    throw { status: 400, message: "Booking already cancelled" };
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });
}

export async function getUserBookings(userId: number) {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { checkIn: "desc" },
    include: { listing: true },
  });
}
