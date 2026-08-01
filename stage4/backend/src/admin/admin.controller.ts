import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { HttpError } from "../utils/http-error.js";
import { adminService } from "./admin.service.js";
import {
  adminInstructorIdParamsSchema,
  updateAdminProfileSchema,
  updateInstructorStatusSchema,
} from "./admin.validation.js";

export const adminController = {
  async getDashboard(
    _request: AuthRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const dashboard = await adminService.getDashboard();
      return response.status(200).json(dashboard);
    } catch (error) {
      next(error);
    }
  },

  async getProfile(
    request: AuthRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      if (!request.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const profile = await adminService.getProfile(request.user.id);
      return response.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  },

  async getInstructors(
    _request: AuthRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const instructors = await adminService.getInstructors();
      return response.status(200).json(instructors);
    } catch (error) {
      next(error);
    }
  },

  async updateInstructorStatus(
    request: AuthRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = adminInstructorIdParamsSchema.parse(request.params);
      const data = updateInstructorStatusSchema.parse(request.body);
      const instructor = await adminService.updateInstructorStatus(id, data);
      return response.status(200).json(instructor);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(
    request: AuthRequest,
    response: Response,
    next: NextFunction,
  ) {
    try {
      if (!request.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const data = updateAdminProfileSchema.parse(request.body);
      const profile = await adminService.updateProfile(
        request.user.id,
        data,
      );

      return response.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  },
};
