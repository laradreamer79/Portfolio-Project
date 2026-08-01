import { Router } from "express";

import { bookingsController } from "./bookings.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import {
  ROLES,
  authorize,
} from "../middleware/role.middleware.js";

export const bookingsRouter = Router();

bookingsRouter.post(
  "/",
  authenticate,
  authorize(ROLES.USER),
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
  "/center",
  authenticate,
  authorize(ROLES.DIVING_CENTER),
  bookingsController.getForCenter,
);

bookingsRouter.get(
  "/instructor",
  authenticate,
  authorize(ROLES.INSTRUCTOR),
  bookingsController.getForInstructor,
);

bookingsRouter.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  bookingsController.getAll,
);
