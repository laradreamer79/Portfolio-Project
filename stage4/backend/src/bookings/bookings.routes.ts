import { Router } from "express";

import {
  createBookingController,
  cancelBookingController,
  myBookingsController,
  allBookingsController,
} from "./bookings.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  ROLES,
  authorizeRoles,
} from "../common/decorators/roles.js";

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

bookingsRouter.get(
  "/",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  allBookingsController,
);
