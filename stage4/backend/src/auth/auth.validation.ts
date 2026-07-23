import { z } from "zod";

const optionalTrimmedString = z
  .string()
  .trim()
  .optional();

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    role: z
      .enum(["user", "instructor", "diving_center"])
      .default("user"),

    instructorLicenseNumber: optionalTrimmedString,
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
  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
