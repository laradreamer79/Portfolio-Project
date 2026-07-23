import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";
import { HttpError } from "../utils/http-error.js";
import { coursesService } from "./courses.service.js";
import {
  courseCreateSchema,
  courseIdParamsSchema,
  courseQuerySchema,
  courseUpdateSchema,
} from "./courses.validation.js";

export const coursesController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = courseQuerySchema.parse(req.query);
      const courses = await coursesService.getAll({
        ...filters,
        actor: req.user,
      });

      return res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = courseIdParamsSchema.parse(req.params);
      const course = await coursesService.getById(id, req.user);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      return res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const body = courseCreateSchema.parse(req.body);
      const imageUrl = req.file
        ? await uploadToCloudinary(req.file, "oyster/courses")
        : undefined;
      const course = await coursesService.create(req.user, {
        ...body,
        imageUrl,
      });

      return res.status(201).json(course);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const { id } = courseIdParamsSchema.parse(req.params);
      const body = courseUpdateSchema.parse(req.body);

      const data = {
        ...body,
        ...(req.file && {
          imageUrl: await uploadToCloudinary(req.file, "oyster/courses"),
        }),
      };

      const course = await coursesService.update(id, req.user, data);

      return res.status(200).json(course);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const { id } = courseIdParamsSchema.parse(req.params);
      await coursesService.delete(id, req.user);

      return res.status(200).json({
        message: "Course deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
