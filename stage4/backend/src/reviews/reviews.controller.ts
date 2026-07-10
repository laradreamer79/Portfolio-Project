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

    const {
      centerId,
      rating,
      tripId,
      courseId,
    } = req.body;

    // Validation

    if (!centerId) {
      return res.status(400).json({
        message: "centerId is required",
      });
    }

    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (tripId && courseId) {
      return res.status(400).json({
        message: "Choose either a trip or a course.",
      });
    }

    const review = await createReview(
      req.user.id,
      req.body,
    );

    return res.status(201).json(review);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create review";

    if (message.includes("already")) {
      return res.status(409).json({ message });
    }

    return res.status(400).json({ message });
  }
}

export async function getReviewsController(
  req: Request,
  res: Response,
) {
  try {
    const centerId = Number(req.params.centerId);

    if (Number.isNaN(centerId)) {
      return res.status(400).json({
        message: "Invalid centerId",
      });
    }

    const reviews = await getReviews(centerId);

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
