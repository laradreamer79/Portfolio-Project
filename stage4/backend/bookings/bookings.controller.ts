import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  cancelBooking,
  createBooking,
  getUserBookings,
} from "./bookings.service.js";
import { createBookingSchema } from "./bookings.validation.js";

export async function create(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) {
  try {
    const body = createBookingSchema.parse(request.body);
    const booking = await createBooking(request.user!.id, body);

    response.status(201).json(booking);
  } catch (error: any) {
    if (error?.issues) {
      return response.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    if (error?.status) {
      return response.status(error.status).json({ message: error.message });
    }

    next(error);
  }
}

export async function cancel(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) {
  try {
    const bookingId = Number(request.params.id);
    const booking = await cancelBooking(
      request.user!.id,
      request.user!.role,
      bookingId,
    );

    response.json(booking);
  } catch (error: any) {
    if (error?.status) {
      return response.status(error.status).json({ message: error.message });
    }

    next(error);
  }
}

export async function myBookings(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) {
  try {
    const bookings = await getUserBookings(request.user!.id);
    response.json(bookings);
  } catch (error: any) {
    next(error);
  }
}
