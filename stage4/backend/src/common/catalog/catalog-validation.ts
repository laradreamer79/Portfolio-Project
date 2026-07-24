import { z } from "zod";
import { DIVING_CITIES } from "../constants/diving-cities.js";

export const catalogIdSchema = z.coerce.number().int().positive();

export const catalogIdParamsSchema = z
  .object({ id: catalogIdSchema })
  .strict();

function normalizeEnumValue<T extends readonly string[]>(values: T) {
  return z.preprocess((value) => {
    if (typeof value !== "string") return value;

    const normalized = value.trim().toLowerCase();
    return values.find((option) => option.toLowerCase() === normalized) ?? value;
  }, z.enum(values));
}

export const cityQuerySchema = normalizeEnumValue(DIVING_CITIES);

export const approvalStatusQuerySchema = normalizeEnumValue([
  "pending",
  "approved",
  "rejected",
  "all",
] as const);

export const catalogQueryShape = {
  city: cityQuerySchema.optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  search: z.string().trim().min(1).max(100).optional(),
  centerId: catalogIdSchema.optional(),
  instructorId: catalogIdSchema.optional(),
  status: approvalStatusQuerySchema.optional(),
};

export function validatePriceRange(
  data: { minPrice?: number; maxPrice?: number },
  context: z.RefinementCtx,
) {
  if (
    data.minPrice !== undefined &&
    data.maxPrice !== undefined &&
    data.minPrice > data.maxPrice
  ) {
    context.addIssue({
      code: "custom",
      path: ["maxPrice"],
      message: "maxPrice must be greater than or equal to minPrice",
    });
  }
}
