import type { Response } from "express";
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
  req: AuthRequest,
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
