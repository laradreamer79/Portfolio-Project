import type { NextFunction, Response } from "express";
import { prisma } from "../prisma/client.js";
import type { AuthRequest } from "./auth.middleware.js";

export async function requireApprovedInstructor(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) {
  if (!request.user || request.user.role !== "instructor") {
    return next();
  }

  const profile = await prisma.instructorProfile.findUnique({
    where: { userId: request.user.id },
    select: { status: true },
  });

  if (profile?.status !== "approved") {
    return response.status(403).json({
      message: "Your instructor account must be approved by an admin",
    });
  }

  next();
}
