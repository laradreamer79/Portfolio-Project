import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { HttpError } from "../utils/http-error.js";
import { authService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const user = await authService.getCurrentUser(req.user.id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
};
