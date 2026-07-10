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

    const { tripId, courseId, numberOfPeople } = req.body;

    // Validation
    if (tripId && courseId) {
      return res.status(400).json({
        message: "Choose either a trip or a course.",
      });
    }

    if (!tripId && !courseId) {
      return res.status(400).json({
        message: "tripId or courseId is required.",
      });
    }

    if (
      !numberOfPeople ||
      typeof numberOfPeople !== "number" ||
      numberOfPeople < 1
    ) {
      return res.status(400).json({
        message: "numberOfPeople must be greater than 0.",
      });
    }

    const booking = await createBooking({
      userId: req.user.id,
      tripId,
      courseId,
      numberOfPeople,
    });

    return res.status(201).json(booking);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create booking";

    if (message === "No available seats") {
      return res.status(409).json({ message });
    }

    return res.status(400).json({ message });
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

    const booking = await cancelBooking(
      Number(req.params.id),
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

    const bookings = await getUserBookings(req.user.id);

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

// Alias used in routes
export const myBookingsController = getMyBookingsController;
