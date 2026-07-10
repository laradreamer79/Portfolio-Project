import { Router } from "express";
import {
  authorizeRoles,
} from "../common/decorators/roles.js";
import {
  ROLES,
  authorizeRoles,
} from "../common/decorators/roles.js";

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
  "/",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  allBookingsController,
);


bookingsRouter.get(
  "/",
  authenticate,
  allBookingsController,
);
