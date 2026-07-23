import { z } from "zod";
import { CENTER_CITIES } from "./centers.constants.js";

const optionalString = z.string().trim().min(1).optional();
const requiredString = z.string().trim().min(1);
const saudiPhone = z
  .string()
  .trim()
  .regex(/^(05\d{8}|\+9665\d{8})$/, "Enter a valid Saudi phone number");

export const centerCreateSchema = z
  .object({
    name: requiredString,
    city: z.enum(CENTER_CITIES),
    address: requiredString,
    licenseNumber: requiredString,
    description: requiredString,
    priceRange: optionalString,
    contactEmail: z.string().trim().email(),
    contactPhone: saudiPhone,
  })
  .strict();

export const centerUpdateSchema = centerCreateSchema
  .omit({ licenseNumber: true })
  .partial()
  .extend({
    status: z.enum(["pending", "approved", "rejected"]).optional(),
  })
  .strict();
