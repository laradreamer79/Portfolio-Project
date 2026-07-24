import { z } from "zod";

export const centerNameSchema = z
  .string()
  .trim()
  .min(2, "Center name must be at least 2 characters")
  .max(120, "Center name must be 120 characters or fewer")
  .refine(
    (value) => /\p{L}/u.test(value),
    "Center name must contain at least one letter",
  );
