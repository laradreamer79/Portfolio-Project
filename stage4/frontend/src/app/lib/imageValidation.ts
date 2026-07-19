/**
 * Client-side image type check.
 *
 * Mirrors the backend's allowed list (see backend/src/middleware/upload.middleware.ts)
 * so unsupported files are caught before upload — the backend currently returns a
 * generic 500 for a rejected mimetype, so this is the only way to surface a clear
 * reason to the user without changing backend behavior.
 */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_IMAGE_LABEL = "JPEG, PNG, or WEBP";

/** Returns a user-facing error message if the file's format isn't supported, otherwise null. */
export function validateImageFile(file: File): string | null {
  if (ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return null;
  }

  const rejectedFormat =
    file.type.split("/")[1]?.toUpperCase() ||
    file.name.split(".").pop()?.toUpperCase() ||
    "This file type";

  return `${rejectedFormat} images aren't supported. Please upload a ${ACCEPTED_IMAGE_LABEL} image instead.`;
}
