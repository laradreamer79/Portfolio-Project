import { z } from "zod";
import {
  dateInputSchema,
  firstZodError,
  imageFileSchema,
  todayOrFutureDateSchema,
  zodFieldErrors,
  type FieldErrors,
} from "../../lib/validation";

export type ListingForm = {
  title: string;
  type: string;
  level: string;
  price: string;
  duration: string;
  depth: string;
  date: string;
  slots: string;
  description: string;
};

type ListingValidationOptions = {
  image: File | null;
  requiresImage: boolean;
  originalDate?: string;
};

type ListingValidationResult =
  | { ok: false; errors: FieldErrors<keyof ListingForm | "image"> }
  | {
      ok: true;
      data: {
        title: string;
        description: string;
        price: number;
        slots: number;
        date: string;
      };
    };

export function validateListingImage(file: File) {
  const result = imageFileSchema.safeParse(file);
  return result.success ? null : firstZodError(result.error);
}

function createListingFormSchema(options: ListingValidationOptions) {
  return z
    .object({
      title: z.string().trim().min(1, "Enter a title."),
      type: z.string(),
      level: z.string(),
      price: z
        .string()
        .min(1, "Enter a valid non-negative price.")
        .transform(Number)
        .refine(
          (price) => Number.isFinite(price) && price >= 0,
          "Enter a valid non-negative price.",
        ),
      duration: z.string(),
      depth: z.string(),
      date: dateInputSchema,
      slots: z.string().transform((value) => (value ? Number(value) : 0)),
      description: z.string().trim().min(1, "Enter a description."),
      image: imageFileSchema.nullable(),
    })
    .superRefine((listing, context) => {
      if (
        listing.type === "trip" &&
        (!Number.isInteger(listing.slots) || listing.slots <= 0)
      ) {
        context.addIssue({
          code: "custom",
          path: ["slots"],
          message: "Enter a positive whole number of spots.",
        });
      }

      if (
        listing.date !== options.originalDate &&
        !todayOrFutureDateSchema.safeParse(listing.date).success
      ) {
        context.addIssue({
          code: "custom",
          path: ["date"],
          message: "Choose today or a future date.",
        });
      }

      if (options.requiresImage && !listing.image) {
        context.addIssue({
          code: "custom",
          path: ["image"],
          message: "Upload an image before publishing.",
        });
      }
    });
}

export function validateListingForm(
  form: ListingForm,
  options: ListingValidationOptions,
): ListingValidationResult {
  const result = createListingFormSchema(options).safeParse({
    ...form,
    image: options.image,
  });

  if (!result.success) {
    return { ok: false, errors: zodFieldErrors(result.error) };
  }

  const { title, description, price, slots, date } = result.data;
  return { ok: true, data: { title, description, price, slots, date } };
}
