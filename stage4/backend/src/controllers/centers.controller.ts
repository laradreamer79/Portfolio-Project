import { Response, NextFunction } from "express";
import { centersService } from "../services/centers.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const centersController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { city, search, status } = req.query;
      const centers = await centersService.getAll({
        city: city as string,
        search: search as string,
        status: status as string,
      });
      res.json(centers);
    } catch (err) { next(err); }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const center = await centersService.getById(id);
      if (!center) return res.status(404).json({ message: "Diving center not found" });
      res.json(center);
    } catch (err) { next(err); }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.id;
      const center = await centersService.create({ ...req.body, ownerId });
      res.status(201).json(center);
    } catch (err) { next(err); }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const center = await centersService.update(id, req.body);
      res.json(center);
    } catch (err) { next(err); }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      await centersService.delete(id);
      res.json({ message: "Diving center deleted successfully" });
    } catch (err) { next(err); }
  },
};