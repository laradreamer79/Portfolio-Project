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
): void {

  const authHeader = request.headers.authorization;


  if (!authHeader?.startsWith("Bearer ")) {
    response.status(401).json({
      message: "Unauthorized",
    });
    return;
  }


  const token = authHeader.split(" ")[1];


  try {

    const decoded = jwt.verify(
      token,
      jwtSecret,
    ) as {
      id:number;
      role:string;
    };


    request.user = decoded;

    next();


  } catch {

    response.status(401).json({
      message:"Invalid token",
    });

  }

}

export function optionalAuthenticate(
  request: AuthRequest,
  _response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      id: number;
      role: string;
    };

    request.user = decoded;
  } catch {
    request.user = undefined;
  }

  return next();
}
