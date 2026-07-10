import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createReview,
  getReviews,
} from "./reviews.service.js";

export async function createReviewController(
  req: AuthRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!req.body.centerId) {
      return res.status(400).json({
        message: "centerId is required",
      });
    }

    if (req.body.rating < 1 || req.body.rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await createReview(
      req.user.id,
      req.body,
    );

    return res.status(201).json(review);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to create review",
    });
  }
}

export async function getReviewsController(
  req: Request,
  res: Response,
) {
  try {
    const reviews = await getReviews(
      Number(req.params.centerId),
    );

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to get reviews",
    });
  }
}
