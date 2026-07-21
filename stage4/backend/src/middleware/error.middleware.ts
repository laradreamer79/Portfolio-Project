import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/http-error.js';
# لمعالجه الأخطاء
export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  console.error(error);

  if (error instanceof HttpError) {
    return response.status(error.statusCode).json({
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'Validation failed',
      details: error.issues,
    });
  }

  return response.status(500).json({
    message: 'Internal server error',
  });
};
# اخطاء غير متوقعه مايحط تفاصيل للمستخدم
