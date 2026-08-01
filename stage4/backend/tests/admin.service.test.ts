import { beforeEach, describe, expect, it, vi } from "vitest";

const userCount = vi.fn();
const centerCount = vi.fn();
const instructorCount = vi.fn();
const instructorFindMany = vi.fn();
const instructorUpdate = vi.fn();
const bookingCount = vi.fn();
const bookingAggregate = vi.fn();
const reviewCount = vi.fn();

vi.mock("../src/prisma/client.js", () => ({
  prisma: {
    user: { count: userCount },
    divingCenter: { count: centerCount },
    instructorProfile: {
      count: instructorCount,
      findMany: instructorFindMany,
      update: instructorUpdate,
    },
    booking: { count: bookingCount, aggregate: bookingAggregate },
    review: { count: reviewCount },
  },
}));

const { adminService } = await import("../src/admin/admin.service.js");

describe("admin instructor approval service", () => {
  beforeEach(() => {
    userCount.mockReset();
    centerCount.mockReset();
    instructorCount.mockReset();
    instructorFindMany.mockReset();
    instructorUpdate.mockReset();
    bookingCount.mockReset();
    bookingAggregate.mockReset();
    reviewCount.mockReset();
  });

  it("includes instructor totals in the dashboard summary", async () => {
    userCount.mockResolvedValue(20);
    centerCount.mockResolvedValueOnce(6).mockResolvedValueOnce(2);
    instructorCount.mockResolvedValueOnce(5).mockResolvedValueOnce(3);
    bookingCount.mockResolvedValueOnce(12).mockResolvedValueOnce(8);
    reviewCount.mockResolvedValue(9);
    bookingAggregate.mockResolvedValue({ _sum: { totalPrice: "1250.50" } });

    await expect(adminService.getDashboard()).resolves.toEqual({
      totalUsers: 20,
      totalCenters: 6,
      pendingCenters: 2,
      totalInstructors: 5,
      pendingInstructors: 3,
      totalBookings: 12,
      confirmedBookings: 8,
      totalReviews: 9,
      totalRevenue: 1250.5,
    });
  });

  it("returns newest instructor registrations with user details", async () => {
    const instructors = [
      {
        id: 4,
        licenseNumber: "INS-400",
        city: "Jeddah",
        status: "pending",
        user: {
          id: 11,
          name: "New Instructor",
          email: "instructor@example.com",
          phone: "0512345678",
        },
      },
    ];
    instructorFindMany.mockResolvedValue(instructors);

    await expect(adminService.getInstructors()).resolves.toEqual(instructors);
    expect(instructorFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: "desc" } }),
    );
  });

  it("updates an instructor approval status", async () => {
    instructorUpdate.mockResolvedValue({ id: 4, status: "approved" });

    await expect(
      adminService.updateInstructorStatus(4, { status: "approved" }),
    ).resolves.toEqual({ id: 4, status: "approved" });
    expect(instructorUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 4 },
        data: { status: "approved" },
      }),
    );
  });
});
