import { z } from "zod";
import {
  DIVING_CITIES,
  type DivingCity,
} from "../common/constants/diving-cities.js";
import { centerNameSchema } from "../common/validation/center-name.js";
import { saudiPhoneSchema } from "../common/validation/saudi-phone.js";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 72;
const MAX_CENTER_NAME_LENGTH = 120;
const MAX_LICENSE_LENGTH = 50;

const emailSchema = z
  .string()
  .trim()
  .max(MAX_EMAIL_LENGTH, "Email must be 254 characters or fewer")
  .email("Invalid email address");
const optionalCity = z.string().trim().optional();
const optionalCenterName = z
  .string()
  .trim()
  .max(
    MAX_CENTER_NAME_LENGTH,
    "Center name must be 120 characters or fewer",
  )
  .optional();
const optionalLicense = z
  .string()
  .trim()
  .max(
    MAX_LICENSE_LENGTH,
    "License number must be 50 characters or fewer",
  )
  .refine(
    (value) => value === "" || /^[0-9]+$/.test(value),
    "License number may contain only numbers",
  )
  .optional();

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(MAX_NAME_LENGTH, "Name must be 100 characters or fewer")
      .regex(
        /^[\p{L}][\p{L}\s'-]*$/u,
        "Name may contain letters, spaces, apostrophes, or hyphens",
      ),

    email: emailSchema,

    phone: saudiPhoneSchema,

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(
        MAX_PASSWORD_LENGTH,
        "Password must be 72 characters or fewer",
      ),

    role: z
      .enum(["user", "instructor", "diving_center"])
      .default("user"),

    instructorLicenseNumber: optionalLicense,
    instructorCity: optionalCity,
    centerName: optionalCenterName,
    centerCity: optionalCity,
    centerLicenseNumber: optionalLicense,
  })
  .superRefine((data, context) => {
    if (
      data.role === "instructor" &&
      (!data.instructorLicenseNumber || data.instructorLicenseNumber.length < 2)
    ) {
      context.addIssue({
        code: "custom",
        path: ["instructorLicenseNumber"],
        message: "Instructor license number is required",
      });
    }

    if (data.role === "instructor") {
      if (!data.instructorCity) {
        context.addIssue({
          code: "custom",
          path: ["instructorCity"],
          message: "Instructor city is required",
        });
      } else if (!DIVING_CITIES.includes(data.instructorCity as DivingCity)) {
        context.addIssue({
          code: "custom",
          path: ["instructorCity"],
          message: "Choose a valid instructor city",
        });
      }
    }

    if (data.role === "diving_center") {
      const centerNameResult = centerNameSchema.safeParse(data.centerName);

      if (!centerNameResult.success) {
        context.addIssue({
          code: "custom",
          path: ["centerName"],
          message:
            centerNameResult.error.issues[0]?.message ??
            "Enter a valid center name",
        });
      }

      if (!data.centerCity || data.centerCity.length < 2) {
        context.addIssue({
          code: "custom",
          path: ["centerCity"],
          message: "Center city is required",
        });
      } else if (!DIVING_CITIES.includes(data.centerCity as DivingCity)) {
        context.addIssue({
          code: "custom",
          path: ["centerCity"],
          message: "Choose a valid center city",
        });
      }

      if (!data.centerLicenseNumber || data.centerLicenseNumber.length < 2) {
        context.addIssue({
          code: "custom",
          path: ["centerLicenseNumber"],
          message: "Center license number is required",
        });
      }
    }
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
