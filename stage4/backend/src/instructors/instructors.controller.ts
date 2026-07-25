import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { HttpError } from "../utils/http-error.js";
import { instructorsService } from "./instructors.service.js";
import { updateInstructorProfileSchema } from "./instructors.validation.js";

export const instructorsController = {
  async getMine(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const profile = await instructorsService.getMine(req.user.id);
      return res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  },

  async updateMine(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const data = updateInstructorProfileSchema.parse(req.body);
      const profile = await instructorsService.updateMine(
        req.user.id,
        data,
      );

      return res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  },
};
