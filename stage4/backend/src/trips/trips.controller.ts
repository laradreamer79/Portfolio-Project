import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";
import { HttpError } from "../utils/http-error.js";
import { tripsService } from "./trips.service.js";
import {
  tripCreateSchema,
  tripIdParamsSchema,
  tripQuerySchema,
  tripUpdateSchema,
} from "./trips.validation.js";

export const tripsController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = tripQuerySchema.parse(req.query);
      const trips = await tripsService.getAll({
        ...filters,
        actor: req.user,
      });

      return res.status(200).json(trips);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = tripIdParamsSchema.parse(req.params);
      const trip = await tripsService.getById(id, req.user);

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      return res.status(200).json(trip);
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const body = tripCreateSchema.parse(req.body);
      const imageUrl = req.file
        ? await uploadToCloudinary(req.file, "oyster/trips")
        : undefined;
      const trip = await tripsService.create(req.user, {
        ...body,
        imageUrl,
      });

      return res.status(201).json(trip);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const { id } = tripIdParamsSchema.parse(req.params);
      const body = tripUpdateSchema.parse(req.body);

      const data = {
        ...body,
        ...(req.file && {
          imageUrl: await uploadToCloudinary(req.file, "oyster/trips"),
        }),
      };

      const trip = await tripsService.update(id, req.user, data);

      return res.status(200).json(trip);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const { id } = tripIdParamsSchema.parse(req.params);
      await tripsService.delete(id, req.user);

      return res.status(200).json({
        message: "Trip deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
