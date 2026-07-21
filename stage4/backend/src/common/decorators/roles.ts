# الملف يقدم نسخه اكثر امانا للصلاحيات
import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export const ROLES = {
  USER: "user",
  INSTRUCTOR: "instructor",
  DIVING_CENTER: "diving_center",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function authorizeRoles(...roles: Role[]) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role as Role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
}
