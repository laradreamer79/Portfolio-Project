import { Router } from "express";
import {
  createReviewController,
  deleteReviewController,
  getAllReviewsController,
  getCenterReviewsController,
  getCourseReviewsController,
  getTripReviewsController,
} from "./reviews.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";


export const reviewsRouter = Router();


reviewsRouter.post(
  "/",
  authenticate,
  createReviewController,
);

reviewsRouter.get(
  "/",
  authenticate,
  authorize("admin"),
  getAllReviewsController,
);

reviewsRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteReviewController,
);

reviewsRouter.get(
  "/center/:centerId",
  getCenterReviewsController,
);

reviewsRouter.get(
  "/trip/:tripId",
  getTripReviewsController,
);

reviewsRouter.get(
  "/course/:courseId",
  getCourseReviewsController,
);
