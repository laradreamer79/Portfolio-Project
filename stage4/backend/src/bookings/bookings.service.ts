import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { HttpError } from "../utils/http-error.js";
import type { CreateBookingInput } from "./bookings.validation.js";

type CreateBookingCommand = CreateBookingInput & {
  userId: number;
};

interface BookingActor {
  id: number;
  role: string;
}

async function create(
  data: CreateBookingCommand,
) {
  if (data.tripId !== undefined && data.courseId !== undefined) {
    throw new HttpError(400, "Choose either a trip or a course");
  }

  if (data.tripId === undefined && data.courseId === undefined) {
    throw new HttpError(400, "Booking must have a trip or course");
  }

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          let totalPrice: number;

          if (data.tripId !== undefined) {
            const trip = await transaction.trip.findUnique({
              where: { id: data.tripId },
            });

            if (!trip) {
              throw new HttpError(404, "Trip not found");
            }

            if (trip.status !== "approved") {
              throw new HttpError(409, "Trip is not approved");
            }

            const bookedPeople = await transaction.booking.aggregate({
              where: {
                tripId: data.tripId,
                status: { not: "cancelled" },
              },
              _sum: { numberOfPeople: true },
            });

            if (
              (bookedPeople._sum.numberOfPeople ?? 0) +
                data.numberOfPeople >
              trip.maxCapacity
            ) {
              throw new HttpError(409, "No available seats");
            }

            totalPrice =
              Number(trip.pricePerPerson) * data.numberOfPeople;
          } else {
            const course = await transaction.course.findUnique({
              where: { id: data.courseId },
            });

            if (!course) {
              throw new HttpError(404, "Course not found");
            }

            if (course.status !== "approved") {
              throw new HttpError(409, "Course is not approved");
            }

            totalPrice = Number(course.price) * data.numberOfPeople;
          }

          return transaction.booking.create({
            data: {
              userId: data.userId,
              tripId: data.tripId,
              courseId: data.courseId,
              numberOfPeople: data.numberOfPeople,
              totalPrice,
            },
            include: {
              trip: true,
              course: true,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      const isWriteConflict =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034";

      if (isWriteConflict && attempt < maxAttempts) continue;
      if (isWriteConflict) {
        throw new HttpError(
          409,
          "Booking availability changed. Please try again.",
        );
      }

      throw error;
    }
  }

  throw new HttpError(409, "Booking availability changed. Please try again.");
}

async function cancel(
  bookingId: number,
  actor: BookingActor,
) {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new HttpError(404, "Booking not found");
  }

  // Booking owners and admins may cancel; other users remain forbidden.
  if (
    actor.role !== "admin" &&
    booking.userId !== actor.id
  ) {
    throw new HttpError(
      403,
      "You are not allowed to cancel this booking",
    );
  }

  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "cancelled",
    },
  });
}

async function getMine(userId: number) {
  return prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      trip: {
        include: {
          center: true,
        },
      },
      course: {
        include: {
          center: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getAll() {
  return prisma.booking.findMany({
    include: {
      user: true,
      trip: true,
      course: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export const bookingsService = {
  create,
  cancel,
  getMine,
  getAll,
};
