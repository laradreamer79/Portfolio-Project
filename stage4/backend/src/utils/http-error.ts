export class HttpError extends Error {
  # Custom Error يحمل HTTP Status Code
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}
