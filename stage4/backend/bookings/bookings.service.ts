import { prisma } from "../generated/prisma";

interface CreateBookingData {
  userId: number;
  tripId?: number;
  courseId?: number;
  numberOfPeople: number;
  totalPrice: number;
}


// Create booking
export async function createBooking(data: CreateBookingData) {
  if (!data.tripId && !data.courseId) {
    throw new Error("Booking must have a trip or a course");
  }

  const booking = await prisma.booking.create({
    data: {
      userId: data.userId,
      tripId: data.tripId,
      courseId: data.courseId,
      numberOfPeople: data.numberOfPeople,
      totalPrice: data.totalPrice,
      status: "pending",
    },
    include: {
      trip: true,
      course: true,
      user: true,
    },
  });

  return booking;
}


// Get booking by ID
export async function getBookingById(id: number) {
  const booking = await prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
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
      payment: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  return booking;
}


// Get all bookings for user
export async function getUserBookings(userId: number) {
  return prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      trip: true,
      course: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}


// Get all bookings (Admin)
export async function getAllBookings() {
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


// Update booking status
export async function updateBookingStatus(
  id: number,
  status: "pending" | "confirmed" | "cancelled",
) {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}


// Cancel booking
export async function cancelBooking(id: number) {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      status: "cancelled",
    },
  });
}


// Delete booking
export async function deleteBooking(id: number) {
  return prisma.booking.delete({
    where: {
      id,
    },
  });
}
