import { z } from "zod";

export const updateAdminProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or fewer")
    .regex(
      /^[\p{L}][\p{L}\s'-]*$/u,
      "Name may contain letters, spaces, apostrophes, or hyphens",
    ),
  email: z
    .string()
    .trim()
    .max(254, "Email must be 254 characters or fewer")
    .email("Invalid email address"),
});

export type UpdateAdminProfileInput = z.infer<
  typeof updateAdminProfileSchema
>;
