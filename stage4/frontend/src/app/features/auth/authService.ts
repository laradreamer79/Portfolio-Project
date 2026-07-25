import { ApiError, apiRequest } from "../../lib/apiClient";
import type { RegistrationRole, UserRole } from "../../lib/roles";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
};

export type AuthResponse = {
  message?: string;
  token: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: RegistrationRole;
  instructorLicenseNumber?: string;
  instructorCity?: string;
  centerName?: string;
  centerCity?: string;
  centerLicenseNumber?: string;
};

export type RegistrationConflictField =
  | "email"
  | "instructorLicenseNumber"
  | "centerLicenseNumber";

export type RegistrationConflictErrors = Partial<
  Record<RegistrationConflictField, string>
>;

const REGISTRATION_CONFLICT_FIELDS = new Set<RegistrationConflictField>([
  "email",
  "instructorLicenseNumber",
  "centerLicenseNumber",
]);

export function registrationConflictErrors(
  error: unknown,
  role: RegistrationRole,
): RegistrationConflictErrors {
  if (!(error instanceof ApiError) || error.status !== 409) return {};

  const details =
    error.details && typeof error.details === "object"
      ? (error.details as {
          field?: unknown;
          fieldErrors?: unknown;
        })
      : undefined;
  const errors: RegistrationConflictErrors = {};

  if (
    details?.fieldErrors &&
    typeof details.fieldErrors === "object"
  ) {
    for (const [field, message] of Object.entries(details.fieldErrors)) {
      if (
        REGISTRATION_CONFLICT_FIELDS.has(
          field as RegistrationConflictField,
        ) &&
        typeof message === "string"
      ) {
        errors[field as RegistrationConflictField] = message;
      }
    }
  }

  if (Object.keys(errors).length > 0) return errors;

  const field = details?.field;

  if (
    typeof field === "string" &&
    REGISTRATION_CONFLICT_FIELDS.has(field as RegistrationConflictField)
  ) {
    return { [field]: error.message };
  }

  const message = error.message.toLowerCase();
  if (message.includes("email")) return { email: error.message };
  if (!message.includes("license")) return {};

  if (role === "instructor") {
    return { instructorLicenseNumber: error.message };
  }
  if (role === "diving_center") {
    return { centerLicenseNumber: error.message };
  }
  return {};
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function getMe(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me", { token });
}
