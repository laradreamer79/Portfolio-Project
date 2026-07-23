import { z } from "zod";
import { DIVING_CITIES } from "../../data";
import {
  emailSchema,
  firstZodError,
  imageFileSchema,
  saudiPhoneSchema,
} from "../../lib/validation";
import type { UpdateCenterPayload } from "../catalog";

type CenterProfileValidationResult =
  | { ok: false; error: string }
  | { ok: true; data: UpdateCenterPayload };

export function validateCenterProfileImage(file: File) {
  const result = imageFileSchema.safeParse(file);
  return result.success ? null : firstZodError(result.error);
}

export const centerProfileSchema = z.object({
  name: z.string().trim().min(1, "Center name is required."),
  city: z.enum(DIVING_CITIES, {
    error: "Choose a valid center city.",
  }),
  contactEmail: z.union([emailSchema, z.literal("")]).optional(),
  contactPhone: z.union([saudiPhoneSchema, z.literal("")]).optional(),
});

export function validateCenterProfile(
  payload: UpdateCenterPayload,
): CenterProfileValidationResult {
  const result = centerProfileSchema.safeParse(payload);
  if (!result.success) {
    return { ok: false, error: firstZodError(result.error) };
  }

  return {
    ok: true,
    data: {
      ...payload,
      ...result.data,
      contactEmail: result.data.contactEmail || undefined,
      contactPhone: result.data.contactPhone || undefined,
    },
  };
}
