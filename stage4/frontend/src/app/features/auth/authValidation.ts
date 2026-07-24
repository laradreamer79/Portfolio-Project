import { z } from "zod";
import { DIVING_CITIES } from "../../data";
import {
  centerNameSchema,
  emailSchema,
  firstZodError,
  personNameSchema,
  saudiPhoneSchema,
} from "../../lib/validation";
import type { LoginPayload } from "./authService";

export const AUTH_FIELD_LIMITS = {
  name: 100,
  email: 254,
  phone: 10,
  password: 72,
  centerName: 120,
  license: 50,
} as const;

const authEmailSchema = emailSchema.max(
  AUTH_FIELD_LIMITS.email,
  "Email must be 254 characters or fewer.",
);
const licenseSchema = z
  .string()
  .max(
    AUTH_FIELD_LIMITS.license,
    "License number must be 50 characters or fewer.",
  )
  .refine(
    (value) => value === "" || /^[0-9]+$/.test(value),
    "License number may contain only numbers.",
  );

export const loginFormSchema = z.object({
  email: authEmailSchema,
  password: z.string().min(1, "Password is required."),
});

export const registerFormSchema = z
  .object({
    name: personNameSchema.max(
      AUTH_FIELD_LIMITS.name,
      "Name must be 100 characters or fewer.",
    ),
    email: authEmailSchema,
    phone: saudiPhoneSchema,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(
        AUTH_FIELD_LIMITS.password,
        "Password must be 72 characters or fewer.",
      ),
    role: z.enum(["user", "instructor", "diving_center"]),
    instructorLicenseNumber: licenseSchema,
    instructorCity: z.string(),
    centerName: z.string().max(
      AUTH_FIELD_LIMITS.centerName,
      "Center name must be 120 characters or fewer.",
    ),
    centerCity: z.string(),
    centerLicenseNumber: licenseSchema,
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
      const centerNameResult = centerNameSchema.safeParse(form.centerName);

      if (!centerNameResult.success) {
        context.addIssue({
          code: "custom",
          path: ["centerName"],
          message:
            centerNameResult.error.issues[0]?.message ??
            "Enter a valid center name.",
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
