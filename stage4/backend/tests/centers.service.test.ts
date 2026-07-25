import { beforeEach, describe, expect, it, vi } from "vitest";

const centerFindMany = vi.fn();
const centerFindFirst = vi.fn();
const reviewGroupBy = vi.fn();

vi.mock("../src/prisma/client.js", () => ({
  prisma: {
    divingCenter: {
      findMany: centerFindMany,
      findFirst: centerFindFirst,
    },
    review: {
      groupBy: reviewGroupBy,
    },
  },
}));

const { centersService } = await import(
  "../src/centers/centers.service.js"
);

describe("center review summaries", () => {
  beforeEach(() => {
    centerFindMany.mockReset();
    centerFindFirst.mockReset();
    reviewGroupBy.mockReset();
  });

  it("adds each center's average direct-review rating to catalog results", async () => {
    centerFindMany.mockResolvedValue([
      { id: 1, name: "First Center" },
      { id: 2, name: "Second Center" },
    ]);
    reviewGroupBy.mockResolvedValue([
      { centerId: 1, _avg: { rating: 4.5 } },
    ]);

    const centers = await centersService.getAll({});

    expect(centers).toEqual([
      { id: 1, name: "First Center", rating: 4.5 },
      { id: 2, name: "Second Center", rating: 0 },
    ]);
  });

  it("calculates the detail rating from direct center reviews", async () => {
    centerFindFirst.mockResolvedValue({
      id: 1,
      name: "First Center",
      reviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }],
    });

    await expect(centersService.getById(1)).resolves.toMatchObject({
      id: 1,
      rating: 4.3,
    });
  });
});
