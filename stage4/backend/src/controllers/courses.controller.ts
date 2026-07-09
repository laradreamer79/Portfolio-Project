import { Response, NextFunction } from "express";
import { coursesService } from "../services/courses.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const coursesController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { city, level, minPrice, maxPrice, search, centerId } = req.query;
      const courses = await coursesService.getAll({
        city: city as string,
        level: level as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        search: search as string,
        centerId: centerId ? parseInt(centerId as string) : undefined,
      });
      res.json(courses);
    } catch (err) { next(err); }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const course = await coursesService.getById(id);
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.json(course);
    } catch (err) { next(err); }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const course = await coursesService.create({
        ...req.body,
        startDate: new Date(req.body.startDate),
      });
      res.status(201).json(course);
    } catch (err) { next(err); }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const data = req.body.startDate
        ? { ...req.body, startDate: new Date(req.body.startDate) }
        : req.body;
      const course = await coursesService.update(id, data);
      res.json(course);
    } catch (err) { next(err); }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      await coursesService.delete(id);
      res.json({ message: "Course deleted successfully" });
    } catch (err) { next(err); }
  },
};