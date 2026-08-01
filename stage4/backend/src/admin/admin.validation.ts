import { z } from "zod";

export const adminInstructorIdParamsSchema = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

export const updateInstructorStatusSchema = z
  .object({
    status: z.enum(["pending", "approved", "rejected"]),
  })
  .strict();

export const updateAdminProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be 100 characters or fewer")
      .regex(
        /^[\p{L}][\p{L}\s'-]*$/u,
        "Name may contain letters, spaces, apostrophes, or hyphens",
      )
      .optional(),
    email: z
      .string()
      .trim()
      .max(254, "Email must be 254 characters or fewer")
      .email("Invalid email address")
      .optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.email !== undefined,
    "Provide a name or email to update",
  );

export type UpdateAdminProfileInput = z.infer<
  typeof updateAdminProfileSchema
>;

export type UpdateInstructorStatusInput = z.infer<
  typeof updateInstructorStatusSchema
>;
