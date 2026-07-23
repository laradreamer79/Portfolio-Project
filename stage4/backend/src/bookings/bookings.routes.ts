import { Router } from "express";

import { bookingsController } from "./bookings.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  ROLES,
  authorizeRoles,
} from "../common/decorators/roles.js";

export const bookingsRouter = Router();

bookingsRouter.post(
  "/",
  authenticate,
  bookingsController.create,
);

bookingsRouter.patch(
  "/:id/cancel",
  authenticate,
  bookingsController.cancel,
);

bookingsRouter.get(
  "/my",
  authenticate,
  bookingsController.getMine,
);

bookingsRouter.get(
  "/",
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  bookingsController.getAll,
);
