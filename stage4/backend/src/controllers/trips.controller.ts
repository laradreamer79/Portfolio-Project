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
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const trip = await tripsService.getById(id);

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      res.json(trip);
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trip = await tripsService.create({
        title: req.body.title,
        description: req.body.description,
        durationHours: Number(req.body.durationHours),
        difficultyLevel: req.body.difficultyLevel,
        pricePerPerson: Number(req.body.pricePerPerson),
        maxCapacity: Number(req.body.maxCapacity),
        scheduleDate: new Date(req.body.scheduleDate),
        centerId: Number(req.body.centerId),
        instructorId: req.body.instructorId
          ? Number(req.body.instructorId)
          : undefined,
        imageUrl: req.file?.path,
      });

      res.status(201).json(trip);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);

      const data = {
        ...req.body,
        ...(req.body.durationHours && {
          durationHours: Number(req.body.durationHours),
        }),
        ...(req.body.pricePerPerson && {
          pricePerPerson: Number(req.body.pricePerPerson),
        }),
        ...(req.body.maxCapacity && {
          maxCapacity: Number(req.body.maxCapacity),
        }),
        ...(req.body.centerId && {
          centerId: Number(req.body.centerId),
        }),
        ...(req.body.instructorId && {
          instructorId: Number(req.body.instructorId),
        }),
        ...(req.body.scheduleDate && {
          scheduleDate: new Date(req.body.scheduleDate),
        }),
        ...(req.file && {
          imageUrl: req.file.path,
        }),
      };

      const trip = await tripsService.update(id, data);

      res.json(trip);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);

      await tripsService.delete(id);

      res.json({ message: "Trip deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};