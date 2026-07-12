import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createBooking,
  cancelBooking,
  getUserBookings,
  getAllBookings,
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

    if (req.body.tripId && req.body.courseId) {
      return res.status(400).json({
        message: "Choose either a trip or a course.",
      });
    }

    if (!req.body.tripId && !req.body.courseId) {
      return res.status(400).json({
        message: "tripId or courseId is required.",
      });
    }

    if (
      typeof req.body.numberOfPeople !== "number" ||
      req.body.numberOfPeople < 1
    ) {
      return res.status(400).json({
        message: "numberOfPeople must be greater than 0",
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
    if (error instanceof Error) {
      if (error.message === "BOOKING_NOT_FOUND") {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      if (error.message === "FORBIDDEN") {
        return res.status(403).json({
          message:
            "You are not allowed to cancel this booking",
        });
      }

      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to cancel booking",
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

export const myBookingsController =
  getMyBookingsController;

export async function allBookingsController(
  req: AuthRequest,
  res: Response,
) {
  try {
    const bookings = await getAllBookings();

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
