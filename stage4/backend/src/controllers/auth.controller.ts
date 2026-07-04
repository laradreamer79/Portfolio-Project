import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}
