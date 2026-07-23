import type { NextFunction, Request, Response } from "express";
import {
  verifyAuthToken,
  type AuthTokenPayload,
} from "../auth/auth.token.js";

export interface AuthRequest extends Request {
  user?: AuthTokenPayload;
}

function getBearerToken(request: Request) {
  const authHeader = request.headers.authorization;
  return authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;
}

export function authenticate(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) {
  const token = getBearerToken(request);

  if (!token) {
    return response.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    request.user = verifyAuthToken(token);
    return next();
  } catch {
    return response.status(401).json({
      message: "Invalid token",
    });
  }
}

export function optionalAuthenticate(
  request: AuthRequest,
  _response: Response,
  next: NextFunction,
) {
  const token = getBearerToken(request);

  if (!token) {
    return next();
  }

  try {
    request.user = verifyAuthToken(token);
  } catch {
    request.user = undefined;
  }

  return next();
}
