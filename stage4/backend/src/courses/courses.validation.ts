import { z } from "zod";
import {
  catalogIdParamsSchema,
  catalogIdSchema,
  catalogQueryShape,
  validatePriceRange,
} from "../common/catalog/catalog-validation.js";

const requiredString = z.string().trim().min(1);
const money = z.coerce.number().nonnegative();
const date = z.coerce.date();

export const courseCreateSchema = z
  .object({
    title: requiredString,
    description: requiredString,
    level: requiredString,
    price: money,
    startDate: date,
    centerId: catalogIdSchema.optional(),
    instructorId: catalogIdSchema.optional(),
  })
  .strict();

export const courseUpdateSchema = courseCreateSchema
  .partial()
  .extend({
    centerId: catalogIdSchema.nullable().optional(),
    instructorId: catalogIdSchema.nullable().optional(),
  })
  .strict();

export const courseQuerySchema = z
  .object({
    ...catalogQueryShape,
    level: z.string().trim().min(1).max(50).optional(),
  })
  .strict()
  .superRefine(validatePriceRange);

export { catalogIdParamsSchema as courseIdParamsSchema };

export type CourseCreateInput = z.infer<typeof courseCreateSchema>;
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;
export type CourseQueryInput = z.infer<typeof courseQuerySchema>;
