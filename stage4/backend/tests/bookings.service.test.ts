import { beforeEach, describe, expect, it, vi } from "vitest";

const bookingFindUnique = vi.fn();
const bookingUpdate = vi.fn();

vi.mock("../src/prisma/client.js", () => ({
  prisma: {
    booking: {
      findUnique: bookingFindUnique,
      update: bookingUpdate,
    },
  },
}));

const { bookingsService } = await import(
  "../src/bookings/bookings.service.js"
);

describe("bookings service cancellation", () => {
  beforeEach(() => {
    bookingFindUnique.mockReset();
    bookingUpdate.mockReset();
  });

  it("returns not found for an unknown booking", async () => {
    bookingFindUnique.mockResolvedValue(null);

    await expect(
      bookingsService.cancel(99, { id: 1, role: "user" }),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Booking not found",
    });
  });

  it("prevents another user from cancelling the booking", async () => {
    bookingFindUnique.mockResolvedValue({
      id: 10,
      userId: 2,
      status: "confirmed",
    });

    await expect(
      bookingsService.cancel(10, { id: 1, role: "user" }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "You are not allowed to cancel this booking",
    });
    expect(bookingUpdate).not.toHaveBeenCalled();
  });

  it("allows the booking owner to cancel", async () => {
    bookingFindUnique.mockResolvedValue({
      id: 10,
      userId: 1,
      status: "confirmed",
    });
    bookingUpdate.mockResolvedValue({
      id: 10,
      userId: 1,
      status: "cancelled",
    });

    const booking = await bookingsService.cancel(10, {
      id: 1,
      role: "user",
    });

    expect(booking.status).toBe("cancelled");
    expect(bookingUpdate).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { status: "cancelled" },
    });
  });

  it("allows an admin to cancel another user's booking", async () => {
    bookingFindUnique.mockResolvedValue({
      id: 10,
      userId: 2,
      status: "confirmed",
    });
    bookingUpdate.mockResolvedValue({
      id: 10,
      userId: 2,
      status: "cancelled",
    });

    await expect(
      bookingsService.cancel(10, { id: 1, role: "admin" }),
    ).resolves.toMatchObject({ status: "cancelled" });
  });
});
