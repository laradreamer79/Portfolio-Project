import { z } from "zod";
import {
  catalogIdParamsSchema,
  catalogIdSchema,
  catalogQueryShape,
  validatePriceRange,
} from "../common/catalog/catalog-validation.js";

const requiredString = z.string().trim().min(1);
const money = z.coerce.number().nonnegative();
const positiveInt = z.coerce.number().int().positive();
const date = z.coerce.date();

export const tripCreateSchema = z
  .object({
    title: requiredString,
    description: requiredString,
    durationHours: positiveInt,
    difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]),
    pricePerPerson: money,
    maxCapacity: positiveInt,
    scheduleDate: date,
    centerId: catalogIdSchema.optional(),
    instructorId: catalogIdSchema.optional(),
  })
  .strict();

export const tripUpdateSchema = tripCreateSchema
  .partial()
  .extend({
    centerId: catalogIdSchema.nullable().optional(),
    instructorId: catalogIdSchema.nullable().optional(),
  })
  .strict();

export const tripQuerySchema = z
  .object({
    ...catalogQueryShape,
    difficulty: z
      .enum(["beginner", "intermediate", "advanced"])
      .optional(),
  })
  .strict()
  .superRefine(validatePriceRange);

export { catalogIdParamsSchema as tripIdParamsSchema };

export type TripCreateInput = z.infer<typeof tripCreateSchema>;
export type TripUpdateInput = z.infer<typeof tripUpdateSchema>;
export type TripQueryInput = z.infer<typeof tripQuerySchema>;
