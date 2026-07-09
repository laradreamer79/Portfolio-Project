import { Response, NextFunction } from "express";
import { tripsService } from "../services/trips.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const tripsController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { city, difficulty, minPrice, maxPrice, search, centerId } = req.query;
      const trips = await tripsService.getAll({
        city: city as string,
        difficulty: difficulty as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        search: search as string,
        centerId: centerId ? parseInt(centerId as string) : undefined,
      });
      res.json(trips);
    } catch (err) { next(err); }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const trip = await tripsService.getById(id);
      if (!trip) return res.status(404).json({ message: "Trip not found" });
      res.json(trip);
    } catch (err) { next(err); }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trip = await tripsService.create({
        ...req.body,
        scheduleDate: new Date(req.body.scheduleDate),
      });
      res.status(201).json(trip);
    } catch (err) { next(err); }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const data = req.body.scheduleDate
        ? { ...req.body, scheduleDate: new Date(req.body.scheduleDate) }
        : req.body;
      const trip = await tripsService.update(id, data);
      res.json(trip);
    } catch (err) { next(err); }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      await tripsService.delete(id);
      res.json({ message: "Trip deleted successfully" });
    } catch (err) { next(err); }
  },
};