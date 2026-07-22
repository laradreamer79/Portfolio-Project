import type { RegistrationRole } from "../../lib/roles";
import { isValidEmail } from "../../lib/validation";
import type { LoginPayload } from "./authService";

export type RegisterFormState = {
  name: string;
  email: string;
  password: string;
  role: RegistrationRole;
  instructorLicenseNumber: string;
  centerName: string;
  centerCity: string;
  centerLicenseNumber: string;
};

export function validateLoginForm(form: LoginPayload): string | null {
  if (!isValidEmail(form.email)) return "Enter a valid email address.";
  if (!form.password) return "Password is required.";
  return null;
}

export function validateRegisterForm(
  form: RegisterFormState,
): string | null {
  if (form.name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }

  if (!isValidEmail(form.email)) return "Enter a valid email address.";

  if (form.password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (
    form.role === "instructor" &&
    form.instructorLicenseNumber.trim().length < 2
  ) {
    return "Instructor license number is required.";
  }

  if (
    form.role === "diving_center" &&
    (form.centerName.trim().length < 2 ||
      form.centerCity.trim().length < 2 ||
      form.centerLicenseNumber.trim().length < 2)
  ) {
    return "Center name, city, and license number are required.";
  }

  return null;
}
