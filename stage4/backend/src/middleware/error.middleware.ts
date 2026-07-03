import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  console.error(error);

  response.status(500).json({
    message: 'Internal server error',
  });
};
