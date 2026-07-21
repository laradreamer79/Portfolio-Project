import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware.js";

export function authorize(...roles: string[]) {
  # تستقبل الأدوار المسموحه
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

    # لانعرف هوية المستخدم
    if (!roles.includes(request.user.role)) {
      return response.status(403).json({
        message: "Forbidden",
      });
    }
# نعرف هويته لكنه غير مسموح
    next();
  };
}
