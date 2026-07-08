import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createBooking,
  cancelBooking,
  getUserBookings,
} from "./bookings.service.js";


export async function createBookingController(
  req: AuthRequest,
  res: Response,
) {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }


    const booking = await createBooking({
      userId: req.user.id,
      tripId: req.body.tripId,
      courseId: req.body.courseId,
      numberOfPeople: req.body.numberOfPeople,
    });


    return res.status(201).json(booking);


  } catch (error) {

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create booking",
    });

  }
}



export async function cancelBookingController(
  req: AuthRequest,
  res: Response,
) {

  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }


    const bookingId = Number(req.params.id);


    const booking = await cancelBooking(
      bookingId,
      req.user.id,
    );


    return res.status(200).json(booking);


  } catch (error) {

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to cancel booking",
    });

  }

}



export async function getMyBookingsController(
  req: AuthRequest,
  res: Response,
) {

  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }


    const bookings = await getUserBookings(
      req.user.id,
    );


    return res.status(200).json(bookings);


  } catch (error) {

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to get bookings",
    });

  }

}

export const myBookingsController = getMyBookingsController;


export async function allBookingsController(
  req: AuthRequest,
  res: Response,
) {
  try {

    const { prisma } = await import("../prisma/client.js");

    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        trip: true,
        course: true,
      },
    });


    return res.status(200).json(bookings);


  } catch (error) {

    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to get bookings",
    });

  }
}
