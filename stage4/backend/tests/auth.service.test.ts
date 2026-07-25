import { beforeEach, describe, expect, it, vi } from "vitest";

const hashPassword = vi.fn();
const userCreate = vi.fn();
const instructorProfileCreate = vi.fn();
const divingCenterCreate = vi.fn();
const userFindUnique = vi.fn();
const instructorProfileFindUnique = vi.fn();
const divingCenterFindUnique = vi.fn();
const transaction = vi.fn();

vi.mock("bcryptjs", () => ({
  default: {
    hash: hashPassword,
    compare: vi.fn(),
  },
}));

vi.mock("../src/prisma/client.js", () => ({
  prisma: {
    $transaction: transaction,
    user: { findUnique: userFindUnique },
    instructorProfile: { findUnique: instructorProfileFindUnique },
    divingCenter: { findUnique: divingCenterFindUnique },
  },
}));

const { authService } = await import("../src/auth/auth.service.js");
const { Prisma } = await import("../src/generated/prisma/client.js");

function uniqueConflict(meta: Record<string, unknown>) {
  return new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
    code: "P2002",
    clientVersion: "test",
    meta,
  });
}

describe("auth service registration phone persistence", () => {
  beforeEach(() => {
    hashPassword.mockReset();
    userCreate.mockReset();
    instructorProfileCreate.mockReset();
    divingCenterCreate.mockReset();
    userFindUnique.mockReset();
    instructorProfileFindUnique.mockReset();
    divingCenterFindUnique.mockReset();
    transaction.mockReset();

    hashPassword.mockResolvedValue("hashed-password");
    userFindUnique.mockResolvedValue(null);
    instructorProfileFindUnique.mockResolvedValue(null);
    divingCenterFindUnique.mockResolvedValue(null);
    transaction.mockImplementation(
      async (
        callback: (client: {
          user: { create: typeof userCreate };
          instructorProfile: { create: typeof instructorProfileCreate };
          divingCenter: { create: typeof divingCenterCreate };
        }) => unknown,
      ) =>
        callback({
          user: { create: userCreate },
          instructorProfile: { create: instructorProfileCreate },
          divingCenter: { create: divingCenterCreate },
        }),
    );
  });

  it.each(["user", "instructor", "diving_center"] as const)(
    "stores the phone on a new %s account",
    async (role) => {
      userCreate.mockResolvedValue({
        id: 10,
        name: "Lara Diver",
        email: "lara@example.com",
        phone: "0512345678",
        role,
      });

      await authService.register({
        name: "Lara Diver",
        email: "lara@example.com",
        phone: "0512345678",
        password: "password123",
        role,
        instructorLicenseNumber: role === "instructor" ? "12345" : "",
        instructorCity: role === "instructor" ? "Jeddah" : "",
        centerName: role === "diving_center" ? "Jazan Diver" : "",
        centerCity: role === "diving_center" ? "Jazan" : "",
        centerLicenseNumber:
          role === "diving_center" ? "98765" : "",
      });

      expect(userCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            phone: "0512345678",
          }),
          select: expect.objectContaining({
            phone: true,
          }),
        }),
      );
    },
  );

  it("uses the registered phone as the diving center contact phone", async () => {
    userCreate.mockResolvedValue({
      id: 10,
      name: "Center Owner",
      email: "owner@example.com",
      phone: "0598765432",
      role: "diving_center",
    });

    await authService.register({
      name: "Center Owner",
      email: "owner@example.com",
      phone: "0598765432",
      password: "password123",
      role: "diving_center",
      centerName: "Jazan Diver",
      centerCity: "Jazan",
      centerLicenseNumber: "98765",
    });

    expect(divingCenterCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        contactPhone: "0598765432",
        ownerId: 10,
      }),
    });
  });

  it("identifies a nested user conflict as a duplicate email", async () => {
    transaction.mockRejectedValue(
      uniqueConflict({
        modelName: "User",
        driverAdapterError: {
          cause: { constraint: { fields: ["email"] } },
        },
      }),
    );

    await expect(
      authService.register({
        name: "Lara Diver",
        email: "lara@example.com",
        phone: "0512345678",
        password: "password123",
        role: "diving_center",
        centerName: "Jazan Diver",
        centerCity: "Jazan",
        centerLicenseNumber: "98765",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Email already exists",
      details: { field: "email" },
    });
  });

  it("returns all duplicate registration fields together", async () => {
    userFindUnique.mockResolvedValue({ id: 1 });
    divingCenterFindUnique.mockResolvedValue({ id: 2 });

    await expect(
      authService.register({
        name: "Center Owner",
        email: "owner@example.com",
        phone: "0598765432",
        password: "password123",
        role: "diving_center",
        centerName: "Jazan Diver",
        centerCity: "Jazan",
        centerLicenseNumber: "98765",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      details: {
        fieldErrors: {
          email: "Email already exists",
          centerLicenseNumber:
            "Diving center license number already exists",
        },
      },
    });

    expect(transaction).not.toHaveBeenCalled();
  });

  it("returns the diving center license field for a license conflict", async () => {
    transaction.mockRejectedValue(
      uniqueConflict({
        modelName: "DivingCenter",
        driverAdapterError: {
          cause: { constraint: { fields: ["licenseNumber"] } },
        },
      }),
    );

    await expect(
      authService.register({
        name: "Center Owner",
        email: "owner@example.com",
        phone: "0598765432",
        password: "password123",
        role: "diving_center",
        centerName: "Jazan Diver",
        centerCity: "Jazan",
        centerLicenseNumber: "98765",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Diving center license number already exists",
      details: { field: "centerLicenseNumber" },
    });
  });

  it("returns the instructor license field for a license conflict", async () => {
    transaction.mockRejectedValue(
      uniqueConflict({
        modelName: "InstructorProfile",
        driverAdapterError: {
          cause: { constraint: { fields: ["licenseNumber"] } },
        },
      }),
    );

    await expect(
      authService.register({
        name: "Dive Instructor",
        email: "instructor@example.com",
        phone: "0512345678",
        password: "password123",
        role: "instructor",
        instructorLicenseNumber: "12345",
        instructorCity: "Jeddah",
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      message: "Instructor license number already exists",
      details: { field: "instructorLicenseNumber" },
    });
  });
});
