import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware.js";

export function authorize(...roles: string[]) {
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
