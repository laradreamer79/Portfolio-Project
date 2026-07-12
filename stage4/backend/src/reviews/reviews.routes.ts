import { Router } from "express";
import {
  createReviewController,
  getCenterReviewsController,
  getCourseReviewsController,
  getTripReviewsController,
} from "./reviews.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";


export const reviewsRouter = Router();


reviewsRouter.post(
  "/",
  authenticate,
  createReviewController,
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
