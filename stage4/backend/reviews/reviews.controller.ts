import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { createReview, getListingReviews } from "./reviews.service.js";
import { createReviewSchema } from "./reviews.validation.js";

export async function create(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) {
  try {
    const body = createReviewSchema.parse(request.body);
    const review = await createReview(request.user!.id, body);

    response.status(201).json(review);
  } catch (error: any) {
    if (error?.issues) {
      return response.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    if (error?.status) {
      return response.status(error.status).json({ message: error.message });
    }

    next(error);
  }
}

export async function listByListing(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const listingId = Number(request.params.listingId);
    const reviews = await getListingReviews(listingId);

    response.json(reviews);
  } catch (error: any) {
    next(error);
  }
}
