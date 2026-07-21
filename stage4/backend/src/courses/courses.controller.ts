import { Response, NextFunction } from "express";
import { coursesService } from "./courses.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";
import {
  courseCreateSchema,
  courseUpdateSchema,
} from "./courses.validation.js";

export const coursesController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        city,
        level,
        minPrice,
        maxPrice,
        search,
        centerId,
        instructorId,
        status,
      } = req.query;

      const courses = await coursesService.getAll({
        city: city as string,
        level: level as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        search: search as string,
        centerId: centerId ? parseInt(centerId as string) : undefined,
        instructorId: instructorId ? parseInt(instructorId as string) : undefined,
        status: status as string,
        actor: req.user,
      });

      res.json(courses);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);

      const course = await coursesService.getById(id, req.user);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json(course);
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const body = courseCreateSchema.parse(req.body);
      const imageUrl = req.file
        ? await uploadToCloudinary(req.file, "oyster/courses")
        : undefined;
      const course = await coursesService.create(req.user!, {
        ...body,
        imageUrl,
      });

      res.status(201).json(course);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const body = courseUpdateSchema.parse(req.body);

      const data = {
        ...body,
        ...(req.file && {
          imageUrl: await uploadToCloudinary(req.file, "oyster/courses"),
        }),
      };

      const course = await coursesService.update(id, req.user!, data);

      res.json(course);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);

      await coursesService.delete(id, req.user!);

      res.json({ message: "Course deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};
