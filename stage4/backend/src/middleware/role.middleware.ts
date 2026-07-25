import type { Response, NextFunction } from "express";
import type { AuthTokenPayload } from "../auth/auth.token.js";
import type { AuthRequest } from "./auth.middleware.js";

export const ROLES = {
  USER: "user",
  INSTRUCTOR: "instructor",
  DIVING_CENTER: "diving_center",
  ADMIN: "admin",
} as const satisfies Record<string, AuthTokenPayload["role"]>;

export type Role = AuthTokenPayload["role"];

export function authorize(...roles: Role[]) {
  return (
    request: AuthRequest,
    response: Response,
    next: NextFunction,
  ) => {
    if (!request.user) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!roles.includes(request.user.role)) {
      return response.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
}
