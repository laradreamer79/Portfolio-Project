export const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SAUDI_PHONE_PATTERN = /^(05\d{8}|\+9665\d{8})$/;
const PERSON_NAME_PATTERN = /^[\p{L}][\p{L}\s'-]*$/u;

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidSaudiPhone(value: string) {
  return SAUDI_PHONE_PATTERN.test(value.replace(/[\s-]/g, ""));
}

export function isValidPersonName(value: string) {
  const name = value.trim();
  return name.length >= 2 && PERSON_NAME_PATTERN.test(name);
}

export function imageValidationError(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return "Upload a JPEG, PNG, or WEBP image.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "The image must be 5 MB or smaller.";
  }

  return null;
}

export function isTodayOrFuture(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const selected = new Date(`${value}T00:00:00`);
  if (Number.isNaN(selected.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected.getTime() >= today.getTime();
}

export function todayInputValue() {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 10);
}
