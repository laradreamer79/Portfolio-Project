import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "./auth.service.js";

import type { AuthRequest } from "../middleware/auth.middleware.js";
import { loginUser, registerUser } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

export async function register(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const body = registerSchema.parse(request.body);

    const result = await registerUser(body);

    response.status(201).json(result);
  } catch (error: any) {
    if (error?.issues) {
      return response.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    if (error?.status) {
      return response.status(error.status).json({
        message: error.message,
      });
    }

    next(error);
  }
}

export async function login(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const body = loginSchema.parse(request.body);

    const result = await loginUser(body);

    response.json(result);
  } catch (error: any) {
    if (error?.issues) {
      return response.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    if (error?.status) {
      return response.status(error.status).json({
        message: error.message,
      });
    }

    next(error);
  }
}

export async function me(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) {
  try {
    const user = await getCurrentUser(request.user!.id);

    response.json(user);
  } catch (error) {
    next(error);
  }
}
