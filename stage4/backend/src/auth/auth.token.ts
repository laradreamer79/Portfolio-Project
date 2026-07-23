import jwt from "jsonwebtoken";
import { z } from "zod";

const TOKEN_EXPIRY = "7d";
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const jwtSecret: string = JWT_SECRET;

const authTokenPayloadSchema = z.object({
  id: z.number().int().positive(),
  role: z.enum(["user", "instructor", "diving_center", "admin"]),
});

export type AuthTokenPayload = z.infer<typeof authTokenPayloadSchema>;

export function createAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: TOKEN_EXPIRY,
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return authTokenPayloadSchema.parse(
    jwt.verify(token, jwtSecret),
  );
}
