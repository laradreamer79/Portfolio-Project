import { beforeEach, describe, expect, it, vi } from "vitest";

const tripFindMany = vi.fn();
const courseFindMany = vi.fn();

vi.mock("../src/prisma/client.js", () => ({
  prisma: {
    trip: { findMany: tripFindMany },
    course: { findMany: courseFindMany },
  },
}));

const { tripsService } = await import("../src/trips/trips.service.js");
const { coursesService } = await import("../src/courses/courses.service.js");

const approvedProviderFilter = {
  OR: [
    { center: { status: "approved" } },
    {
      instructor: {
        instructorProfile: { status: "approved" },
      },
    },
  ],
};

describe("public catalog provider approval", () => {
  beforeEach(() => {
    tripFindMany.mockReset();
    courseFindMany.mockReset();
    tripFindMany.mockResolvedValue([]);
    courseFindMany.mockResolvedValue([]);
  });

  it("requires an approved provider for public trips", async () => {
    await tripsService.getAll({});

    expect(tripFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: [approvedProviderFilter],
        }),
      }),
    );
  });

  it("requires an approved provider for public courses", async () => {
    await coursesService.getAll({});

    expect(courseFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: [approvedProviderFilter],
        }),
      }),
    );
  });
});
