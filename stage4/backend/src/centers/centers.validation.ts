import { z } from "zod";
import {
  catalogIdParamsSchema,
  catalogIdSchema,
} from "../common/catalog/catalog-validation.js";
import { DIVING_CITIES } from "../common/constants/diving-cities.js";
import { centerNameSchema } from "../common/validation/center-name.js";
import { saudiPhoneSchema } from "../common/validation/saudi-phone.js";

const optionalString = z.string().trim().min(1).optional();
const requiredString = z.string().trim().min(1);

export const centerCreateSchema = z
  .object({
    name: centerNameSchema,
    city: z.enum(DIVING_CITIES),
    address: requiredString,
    licenseNumber: requiredString,
    description: requiredString,
    priceRange: optionalString,
    contactEmail: z.string().trim().email(),
    contactPhone: saudiPhoneSchema,
  })
  .strict();

export const centerUpdateSchema = centerCreateSchema
  .omit({ licenseNumber: true })
  .partial()
  .extend({
    status: z.enum(["pending", "approved", "rejected"]).optional(),
  })
  .strict();

export const centerQuerySchema = z
  .object({
    city: z.enum(DIVING_CITIES).optional(),
    search: z.string().trim().min(1).max(100).optional(),
    status: z
      .enum(["pending", "approved", "rejected", "all"])
      .optional(),
    ownerId: catalogIdSchema.optional(),
  })
  .strict();

export { catalogIdParamsSchema as centerIdParamsSchema };

export type CenterQueryInput = z.infer<typeof centerQuerySchema>;
