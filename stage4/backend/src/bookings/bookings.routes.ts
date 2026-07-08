import { Router } from "express";

import {
  createBookingController,
  cancelBookingController,
  myBookingsController,
  allBookingsController,
} from "./bookings.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";


export const bookingsRouter = Router();


bookingsRouter.post(
  "/",
  authenticate,
  createBookingController,
);


bookingsRouter.patch(
  "/:id/cancel",
  authenticate,
  cancelBookingController,
);


bookingsRouter.get(
  "/my",
  authenticate,
  myBookingsController,
);


// later we add admin role check
bookingsRouter.get(
  "/",
  authenticate,
  allBookingsController,
);
