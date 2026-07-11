import { Response, NextFunction } from "express";
import { tripsService } from "../services/trips.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";
import {
  tripCreateSchema,
  tripUpdateSchema,
} from "../validation/catalog.validation.js";

export const tripsController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        city,
        difficulty,
        minPrice,
        maxPrice,
        search,
        centerId,
        instructorId,
        status,
      } = req.query;

      const trips = await tripsService.getAll({
        city: city as string,
        difficulty: difficulty as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        search: search as string,
        centerId: centerId ? parseInt(centerId as string) : undefined,
        instructorId: instructorId ? parseInt(instructorId as string) : undefined,
        status: status as string,
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
      const body = tripCreateSchema.parse(req.body);
      const imageUrl = req.file
        ? await uploadToCloudinary(req.file, "oyster/trips")
        : undefined;
      const trip = await tripsService.create(req.user!, {
        ...body,
        imageUrl,
      });

      res.status(201).json(trip);
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const body = tripUpdateSchema.parse(req.body);

      const data = {
        ...body,
        ...(req.file && {
          imageUrl: await uploadToCloudinary(req.file, "oyster/trips"),
        }),
      };

      const trip = await tripsService.update(id, req.user!, data);

      res.json(trip);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);

      await tripsService.delete(id, req.user!);

      res.json({ message: "Trip deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};
