import { beforeEach, describe, expect, it, vi } from "vitest";

const hashPassword = vi.fn();
const userCreate = vi.fn();
const instructorProfileCreate = vi.fn();
const divingCenterCreate = vi.fn();
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
  },
}));

const { authService } = await import("../src/auth/auth.service.js");

describe("auth service registration phone persistence", () => {
  beforeEach(() => {
    hashPassword.mockReset();
    userCreate.mockReset();
    instructorProfileCreate.mockReset();
    divingCenterCreate.mockReset();
    transaction.mockReset();

    hashPassword.mockResolvedValue("hashed-password");
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
});
