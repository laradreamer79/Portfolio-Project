import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createReview,
  deleteReview,
  getAllReviews,
  getCenterReviews,
  getCourseReviews,
  getTripReviews,
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
      tripId,
      courseId,
      rating,
      comment,
    } = req.body;

    // Must review exactly one item
    const reviewTargets =
      Number(!!centerId) +
      Number(!!tripId) +
      Number(!!courseId);

    if (reviewTargets !== 1) {
      return res.status(400).json({
        message:
          "Provide exactly one of centerId, tripId, or courseId.",
      });
    }

    // Rating validation
    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await createReview(
      req.user.id,
      {
        centerId,
        tripId,
        courseId,
        rating,
        comment,
      },
    );

    return res.status(201).json(review);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create review";

    if (
      message ===
      "You have already reviewed this item"
    ) {
      return res.status(409).json({
        message,
      });
    }

    return res.status(400).json({
      message,
    });
  }
}

function parsePositiveId(
  value: string | string[] | undefined,
  name: string,
) {
  if (typeof value !== "string") {
    throw new Error(`Invalid ${name}`);
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id < 1) {
    throw new Error(`Invalid ${name}`);
  }

  return id;
}

export async function getAllReviewsController(
  _req: AuthRequest,
  res: Response,
) {
  try {
    const reviews = await getAllReviews();

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

export async function deleteReviewController(
  req: AuthRequest,
  res: Response,
) {
  try {
    const id = parsePositiveId(req.params.id, "reviewId");

    await deleteReview(id);

    return res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete review";

    return res.status(message === "Review not found" ? 404 : 400).json({
      message,
    });
  }
}

export async function getCenterReviewsController(
  req: Request,
  res: Response,
) {
  try {
    const centerId = parsePositiveId(
      req.params.centerId,
      "centerId",
    );

    const reviews = await getCenterReviews(centerId);

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to get center reviews",
    });
  }
}

export async function getTripReviewsController(
  req: Request,
  res: Response,
) {
  try {
    const tripId = parsePositiveId(
      req.params.tripId,
      "tripId",
    );

    const reviews = await getTripReviews(tripId);

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to get trip reviews",
    });
  }
}

export async function getCourseReviewsController(
  req: Request,
  res: Response,
) {
  try {
    const courseId = parsePositiveId(
      req.params.courseId,
      "courseId",
    );

    const reviews = await getCourseReviews(courseId);

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to get course reviews",
    });
  }
}
