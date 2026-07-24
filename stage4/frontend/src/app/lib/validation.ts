import { z } from "zod";

export const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address.");

export const saudiPhoneSchema = z
  .string()
  .regex(
    /^05\d{8}$/,
    "Phone number must contain 10 digits and start with 05.",
  );

export const personNameSchema = z
  .string()
  .trim()
  .min(2, "Enter a name using at least two letters.")
  .regex(
    /^[\p{L}][\p{L}\s'-]*$/u,
    "Enter a name using letters, spaces, apostrophes, or hyphens.",
  );

export const centerNameSchema = z
  .string()
  .trim()
  .min(2, "Center name must be at least 2 characters.")
  .max(120, "Center name must be 120 characters or fewer.")
  .refine(
    (value) => /\p{L}/u.test(value),
    "Center name must contain at least one letter.",
  );

export const imageFileSchema = z
  .custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
    "Choose an image file.",
  )
  .superRefine((file, context) => {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      context.addIssue({
        code: "custom",
        message: "Upload a JPEG, PNG, or WEBP image.",
      });
    }

    if (file.size > MAX_IMAGE_SIZE) {
      context.addIssue({
        code: "custom",
        message: "The image must be 5 MB or smaller.",
      });
    }
  });

export const dateInputSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")
  .refine(
    (value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()),
    "Choose a valid date.",
  );

export const todayOrFutureDateSchema = dateInputSchema.refine((value) => {
  const selected = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected.getTime() >= today.getTime();
}, "Choose today or a future date.");

export function firstZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Enter valid information.";
}

export function todayInputValue() {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 10);
}
