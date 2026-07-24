import { describe, expect, it } from "vitest";
import {
  loginFormSchema,
  registerFormSchema,
  validateLoginForm,
  validateRegisterForm,
  type RegisterFormState,
} from "../src/app/features/auth/authValidation";

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
    expect(validateLoginForm(form)).toBeNull();
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
    expect(validateRegisterForm(validUser)).toBeNull();
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

  it("returns the first validation message used by the red error box", () => {
    expect(validateRegisterForm({ ...validUser, name: "" })).toBe(
      "Enter a name using at least two letters.",
    );
  });
});
