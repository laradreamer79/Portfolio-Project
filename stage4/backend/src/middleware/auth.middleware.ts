import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const jwtSecret: string = JWT_SECRET;

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export function authenticate(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return response.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      id: number;
      role: string;
    };

    request.user = decoded;

    next();
  } catch {
    return response.status(401).json({
      message: "Invalid token",
    });
  }
}

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
