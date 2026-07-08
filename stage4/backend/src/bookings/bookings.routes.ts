import { Router } from "express";

import {
  createBookingController,
  cancelBookingController,
  myBookingsController,
  allBookingsController,
} from "./bookings.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";


export const bookingsRouter = Router();


bookingsRouter.post(
  "/",
  authMiddleware,
  createBookingController
);


bookingsRouter.patch(
  "/:id/cancel",
  authMiddleware,
  cancelBookingController
);


bookingsRouter.get(
  "/my",
  authMiddleware,
  myBookingsController
);


// later protect with admin middleware
bookingsRouter.get(
  "/",
  authMiddleware,
  allBookingsController
);
