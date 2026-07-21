import type { Request, Response } from 'express';
# عندما لايطابق الطلب اي راوت عندنا 
export function notFound(request: Request, response: Response): void {
  response.status(404).json({
    message: `Route ${request.method} ${request.originalUrl} was not found`,
  });
}
