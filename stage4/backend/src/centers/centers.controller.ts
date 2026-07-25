import type { NextFunction, Response } from "express";
import { centersService } from "./centers.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";
import { HttpError } from "../utils/http-error.js";
import {
  centerCreateSchema,
  centerIdParamsSchema,
  centerQuerySchema,
  centerUpdateSchema,
} from "./centers.validation.js";

export const centersController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = centerQuerySchema.parse(req.query);
      const centers = await centersService.getAll({
        ...filters,
        actor: req.user,
      });
      return res.status(200).json(centers);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = centerIdParamsSchema.parse(req.params);
      const center = await centersService.getById(id, req.user);
      if (!center) return res.status(404).json({ message: "Diving center not found" });
      return res.status(200).json(center);
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const body = centerCreateSchema.parse(req.body);
      const imageUrl = req.file
        ? await uploadToCloudinary(req.file, "oyster/centers")
        : undefined;
      const center = await centersService.create({
        ...body,
        ownerId: req.user.id,
        ...(imageUrl && { imageUrl }),
      });
      return res.status(201).json(center);
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const { id } = centerIdParamsSchema.parse(req.params);
      const body = centerUpdateSchema.parse(req.body);
      const imageUrl = req.file
        ? await uploadToCloudinary(req.file, "oyster/centers")
        : undefined;
      const center = await centersService.update(id, req.user, {
        ...body,
        ...(imageUrl && { imageUrl }),
      });
      return res.status(200).json(center);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = centerIdParamsSchema.parse(req.params);
      await centersService.delete(id);
      return res.status(200).json({
        message: "Diving center deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
