import { Router } from "express";

import {
  createReviewController,
  getReviewsController,
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
  getReviewsController,
);
