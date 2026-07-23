import { z } from "zod";
import { DIVING_CITIES } from "../../data";
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
    instructorCity: z.string(),
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

    if (form.role === "instructor") {
      if (!form.instructorCity) {
        context.addIssue({
          code: "custom",
          path: ["instructorCity"],
          message: "Instructor city is required.",
        });
      } else if (
        !DIVING_CITIES.includes(
          form.instructorCity as (typeof DIVING_CITIES)[number],
        )
      ) {
        context.addIssue({
          code: "custom",
          path: ["instructorCity"],
          message: "Choose a valid instructor city.",
        });
      }
    }

    if (form.role === "diving_center") {
      if (form.centerName.trim().length < 2) {
        context.addIssue({
          code: "custom",
          path: ["centerName"],
          message: "Center name is required.",
        });
      }

      if (form.centerCity.trim().length < 2) {
        context.addIssue({
          code: "custom",
          path: ["centerCity"],
          message: "Center city is required.",
        });
      } else if (
        !DIVING_CITIES.includes(
          form.centerCity as (typeof DIVING_CITIES)[number],
        )
      ) {
        context.addIssue({
          code: "custom",
          path: ["centerCity"],
          message: "Choose a valid center city.",
        });
      }

      if (form.centerLicenseNumber.trim().length < 2) {
        context.addIssue({
          code: "custom",
          path: ["centerLicenseNumber"],
          message: "Center license number is required.",
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
