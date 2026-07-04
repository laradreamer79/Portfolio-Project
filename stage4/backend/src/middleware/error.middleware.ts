import type { ErrorRequestHandler } from "express";

type AppError = {
  status?: number;
  message?: string;
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  console.error(error);

  const appError = error as AppError;

  response.status(appError.status || 500).json({
    message: appError.message || "Internal server error",
  });
};
