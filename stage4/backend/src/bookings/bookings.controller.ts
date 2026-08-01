import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { HttpError } from "../utils/http-error.js";
import { bookingsService } from "./bookings.service.js";
import {
  bookingIdParamsSchema,
  centerBookingsQuerySchema,
  createBookingSchema,
} from "./bookings.validation.js";

export const bookingsController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const data = createBookingSchema.parse(req.body);
      const booking = await bookingsService.create({
        userId: req.user.id,
        ...data,
      });

      return res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  },

  async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const { id } = bookingIdParamsSchema.parse(req.params);
      const booking = await bookingsService.cancel(id, req.user);

      return res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  },

  async getMine(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const bookings = await bookingsService.getMine(req.user.id);
      return res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  },

  async getForCenter(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const { centerId } = centerBookingsQuerySchema.parse(req.query);
      const bookings = await bookingsService.getForCenter(centerId, req.user);
      return res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  },

  async getForInstructor(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const bookings = await bookingsService.getForInstructor(req.user.id);
      return res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  },

  async getAll(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const bookings = await bookingsService.getAll();
      return res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  },
};
