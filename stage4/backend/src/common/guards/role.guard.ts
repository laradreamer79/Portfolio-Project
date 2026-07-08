import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";


export function roleGuard(
  ...allowedRoles: string[]
) {

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



    if (
      !allowedRoles.includes(
        request.user.role,
      )
    ) {

      return response.status(403).json({
        message: "Forbidden",
      });

    }



    next();

  };

}
