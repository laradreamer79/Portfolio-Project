import { Response, NextFunction } from "express";
import { coursesService } from "../services/courses.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";

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
      });

      res.json(courses);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);

      const course = await coursesService.getById(id);

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
      const imageUrl = req.file
        ? await uploadToCloudinary(req.file, "oyster/courses")
        : undefined;
      const course = await coursesService.create({
        title: req.body.title,
        description: req.body.description,
        level: req.body.level,
        price: Number(req.body.price),
        startDate: new Date(req.body.startDate),
        centerId: Number(req.body.centerId),
        instructorId: req.body.instructorId
          ? Number(req.body.instructorId)
          : undefined,
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

      const data = {
        ...req.body,
        ...(req.body.price && {
          price: Number(req.body.price),
        }),
        ...(req.body.centerId && {
          centerId: Number(req.body.centerId),
        }),
        ...(req.body.instructorId && {
          instructorId: Number(req.body.instructorId),
        }),
        ...(req.body.startDate && {
          startDate: new Date(req.body.startDate),
        }),
        ...(req.file && {
          imageUrl: await uploadToCloudinary(req.file, "oyster/courses"),
        }),
      };

      const course = await coursesService.update(id, data);

      res.json(course);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);

      await coursesService.delete(id);

      res.json({ message: "Course deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};
