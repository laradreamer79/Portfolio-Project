import { Router } from "express";

import {
  createReviewController,
  getReviewsController,
} from "./reviews.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";


export const reviewsRouter = Router();


reviewsRouter.post(
  "/",
  authMiddleware,
  createReviewController
);


reviewsRouter.get(
  "/",
  getReviewsController
);
