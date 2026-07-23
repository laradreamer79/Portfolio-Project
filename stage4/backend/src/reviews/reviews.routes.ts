import { Router } from "express";
import { reviewsController } from "./reviews.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

export const reviewsRouter = Router();

reviewsRouter.post(
  "/",
  authenticate,
  reviewsController.create,
);

reviewsRouter.get(
  "/",
  authenticate,
  authorize("admin"),
  reviewsController.getAll,
);

reviewsRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  reviewsController.delete,
);

reviewsRouter.get(
  "/center/:centerId",
  reviewsController.getByCenter,
);

reviewsRouter.get(
  "/trip/:tripId",
  reviewsController.getByTrip,
);

reviewsRouter.get(
  "/course/:courseId",
  reviewsController.getByCourse,
);
