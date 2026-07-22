import {
  imageValidationError,
  isValidEmail,
  isValidSaudiPhone,
} from "../../lib/validation";
import type { UpdateCenterPayload } from "../catalog";

type CenterProfileValidationResult =
  | { ok: false; error: string }
  | { ok: true; data: UpdateCenterPayload };

export function validateCenterProfileImage(file: File) {
  return imageValidationError(file);
}

export function validateCenterProfile(
  payload: UpdateCenterPayload,
): CenterProfileValidationResult {
  if (!payload.name?.trim() || !payload.city?.trim()) {
    return { ok: false, error: "Center name and city are required." };
  }

  if (payload.contactEmail && !isValidEmail(payload.contactEmail)) {
    return { ok: false, error: "Enter a valid contact email address." };
  }

  if (payload.contactPhone && !isValidSaudiPhone(payload.contactPhone)) {
    return {
      ok: false,
      error:
        "Enter a Saudi phone number such as 05XXXXXXXX or +9665XXXXXXXX.",
    };
  }

  return {
    ok: true,
    data: {
      ...payload,
      contactPhone: payload.contactPhone?.replace(/[\s-]/g, ""),
    },
  };
}
