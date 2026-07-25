import { z } from "zod";
import { DIVING_CITIES } from "../common/constants/diving-cities.js";

export const updateInstructorProfileSchema = z
  .object({
    city: z.enum(DIVING_CITIES),
  })
  .strict();

export type UpdateInstructorProfileInput = z.infer<
  typeof updateInstructorProfileSchema
>;
