import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { HttpError } from "../utils/http-error.js";
import { reviewsService } from "./reviews.service.js";
import {
  centerReviewParamsSchema,
  courseReviewParamsSchema,
  createReviewSchema,
  reviewIdParamsSchema,
  tripReviewParamsSchema,
} from "./reviews.validation.js";

export const reviewsController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const data = createReviewSchema.parse(req.body);
      const review = await reviewsService.create(req.user.id, data);

      return res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  },

  async getAll(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reviews = await reviewsService.getAll();
      return res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = reviewIdParamsSchema.parse(req.params);
      await reviewsService.delete(id);

      return res.status(200).json({
        message: "Review deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async getByCenter(req: Request, res: Response, next: NextFunction) {
    try {
      const { centerId } = centerReviewParamsSchema.parse(req.params);
      const reviews = await reviewsService.getByCenter(centerId);
      return res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  },

  async getByTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = tripReviewParamsSchema.parse(req.params);
      const reviews = await reviewsService.getByTrip(tripId);
      return res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  },

  async getByCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = courseReviewParamsSchema.parse(req.params);
      const reviews = await reviewsService.getByCourse(courseId);
      return res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  },
};
