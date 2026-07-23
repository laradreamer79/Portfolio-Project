import { z } from "zod";
import { emailSchema, firstZodError } from "../../lib/validation";
import type { LoginPayload } from "./authService";

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export const registerFormSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    email: emailSchema,
    password: z.string().min(8, "Password must be at least 8 characters."),
    role: z.enum(["user", "instructor", "diving_center"]),
    instructorLicenseNumber: z.string(),
    centerName: z.string(),
    centerCity: z.string(),
    centerLicenseNumber: z.string(),
  })
  .superRefine((form, context) => {
    if (
      form.role === "instructor" &&
      form.instructorLicenseNumber.trim().length < 2
    ) {
      context.addIssue({
        code: "custom",
        path: ["instructorLicenseNumber"],
        message: "Instructor license number is required.",
      });
    }

    if (form.role === "diving_center") {
      const requiredCenterFields = [
        form.centerName,
        form.centerCity,
        form.centerLicenseNumber,
      ];

      if (requiredCenterFields.some((value) => value.trim().length < 2)) {
        context.addIssue({
          code: "custom",
          path: ["centerName"],
          message: "Center name, city, and license number are required.",
        });
      }
    }
  });

export type RegisterFormState = z.input<typeof registerFormSchema>;

export function validateLoginForm(form: LoginPayload): string | null {
  const result = loginFormSchema.safeParse(form);
  return result.success ? null : firstZodError(result.error);
}

export function validateRegisterForm(form: RegisterFormState): string | null {
  const result = registerFormSchema.safeParse(form);
  return result.success ? null : firstZodError(result.error);
}
