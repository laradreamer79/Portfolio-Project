import { z } from "zod";
import { DIVING_CITIES } from "../constants/diving-cities.js";

export const catalogIdSchema = z.coerce.number().int().positive();

export const catalogIdParamsSchema = z
  .object({ id: catalogIdSchema })
  .strict();

export const catalogQueryShape = {
  city: z.enum(DIVING_CITIES).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  search: z.string().trim().min(1).max(100).optional(),
  centerId: catalogIdSchema.optional(),
  instructorId: catalogIdSchema.optional(),
  status: z
    .enum(["pending", "approved", "rejected", "all"])
    .optional(),
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
