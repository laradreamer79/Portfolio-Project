import { z } from "zod";
import {
  DIVING_CITIES,
  type DivingCity,
} from "../common/constants/diving-cities.js";

const optionalTrimmedString = z.string().trim().optional();
const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address");

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters"),

    email: emailSchema,

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    role: z
      .enum(["user", "instructor", "diving_center"])
      .default("user"),

    instructorLicenseNumber: optionalTrimmedString,
    instructorCity: optionalTrimmedString,
    centerName: optionalTrimmedString,
    centerCity: optionalTrimmedString,
    centerLicenseNumber: optionalTrimmedString,
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
      if (!data.centerName || data.centerName.length < 2) {
        context.addIssue({
          code: "custom",
          path: ["centerName"],
          message: "Center name is required",
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
