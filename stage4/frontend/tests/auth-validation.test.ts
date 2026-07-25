import { describe, expect, it } from "vitest";
import {
  loginFormSchema,
  registerFormSchema,
  validateLoginForm,
  validateRegisterForm,
  type RegisterFormState,
} from "../src/app/features/auth/authValidation";
import { registrationConflictErrors } from "../src/app/features/auth/authService";
import { ApiError } from "../src/app/lib/apiClient";

const emptyRoleFields = {
  instructorLicenseNumber: "",
  instructorCity: "",
  centerName: "",
  centerCity: "",
  centerLicenseNumber: "",
};

const validUser: RegisterFormState = {
  name: "Lara Diver",
  email: "lara@example.com",
  phone: "0512345678",
  password: "password123",
  role: "user",
  ...emptyRoleFields,
};

describe("login form", () => {
  it("accepts valid existing-account credentials", () => {
    const form = {
      email: "lara@example.com",
      password: "existing-password",
    };

    expect(loginFormSchema.safeParse(form).success).toBe(true);
    expect(validateLoginForm(form)).toEqual({});
  });

  it("rejects an invalid email or an empty password", () => {
    expect(
      loginFormSchema.safeParse({ email: "invalid", password: "" }).success,
    ).toBe(false);
  });

  it("does not enforce the registration password length on login", () => {
    expect(
      loginFormSchema.safeParse({
        email: "old-user@example.com",
        password: "123456",
      }).success,
    ).toBe(true);
  });
});

describe("registration form", () => {
  it("accepts a valid normal user", () => {
    expect(registerFormSchema.safeParse(validUser).success).toBe(true);
    expect(validateRegisterForm(validUser)).toEqual({});
  });

  it.each([
    [{ ...validUser, name: "1" }, "name"],
    [{ ...validUser, email: "not-an-email" }, "email"],
    [{ ...validUser, phone: "12345" }, "phone"],
    [{ ...validUser, phone: "+966512345678" }, "international phone"],
    [{ ...validUser, password: "1234567" }, "password"],
    [{ ...validUser, password: "x".repeat(73) }, "password maximum"],
  ])("rejects an invalid %s", (form) => {
    expect(registerFormSchema.safeParse(form).success).toBe(false);
  });

  it("accepts a valid instructor and validates its city and license", () => {
    const instructor: RegisterFormState = {
      ...validUser,
      role: "instructor",
      instructorLicenseNumber: "12345",
      instructorCity: "Jeddah",
    };

    expect(registerFormSchema.safeParse(instructor).success).toBe(true);
    expect(
      registerFormSchema.safeParse({
        ...instructor,
        instructorLicenseNumber: "ABC",
      }).success,
    ).toBe(false);
    expect(
      registerFormSchema.safeParse({
        ...instructor,
        instructorCity: "Unknown City",
      }).success,
    ).toBe(false);
  });

  it("accepts a valid center and validates its name, city, and license", () => {
    const center: RegisterFormState = {
      ...validUser,
      role: "diving_center",
      centerName: "Jazan Diver 360",
      centerCity: "Jazan",
      centerLicenseNumber: "98765",
    };

    expect(registerFormSchema.safeParse(center).success).toBe(true);
    expect(
      registerFormSchema.safeParse({ ...center, centerName: "12345" })
        .success,
    ).toBe(false);
    expect(
      registerFormSchema.safeParse({ ...center, centerCity: "Unknown" })
        .success,
    ).toBe(false);
    expect(
      registerFormSchema.safeParse({
        ...center,
        centerLicenseNumber: "SA-22",
      }).success,
    ).toBe(false);
  });

  it("returns all validation messages by field", () => {
    expect(
      validateRegisterForm({
        ...validUser,
        name: "",
        email: "invalid",
        phone: "123",
      }),
    ).toEqual({
      name: "Enter a name using at least two letters.",
      email: "Enter a valid email address.",
      phone: "Phone number must contain 10 digits and start with 05.",
    });
  });

  it("maps duplicate license conflicts to the active role field", () => {
    expect(
      registrationConflictErrors(
        new ApiError(
          "Instructor license number already exists",
          409,
          { field: "instructorLicenseNumber" },
        ),
        "instructor",
      ),
    ).toEqual({
      instructorLicenseNumber:
        "Instructor license number already exists",
    });

    expect(
      registrationConflictErrors(
        new ApiError("Diving center license number already exists", 409),
        "diving_center",
      ),
    ).toEqual({
      centerLicenseNumber:
        "Diving center license number already exists",
    });
  });

  it("returns duplicate email and license errors together", () => {
    expect(
      registrationConflictErrors(
        new ApiError("Email already exists", 409, {
          fieldErrors: {
            email: "Email already exists",
            centerLicenseNumber:
              "Diving center license number already exists",
          },
        }),
        "diving_center",
      ),
    ).toEqual({
      email: "Email already exists",
      centerLicenseNumber:
        "Diving center license number already exists",
    });
  });
});
