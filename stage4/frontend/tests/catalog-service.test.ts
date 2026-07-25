import { describe, expect, it } from "vitest";
import {
  toCenter,
  type ApiCenter,
} from "../src/app/features/catalog/catalogService";

const center: ApiCenter = {
  id: 1,
  name: "Jazan Diver",
  city: "Jazan",
  rating: 4.5,
  _count: { reviews: 2 },
};

describe("center catalog mapping", () => {
  it("uses the API review rating and count in center cards", () => {
    expect(toCenter(center)).toMatchObject({
      rating: 4.5,
      reviews: 2,
    });
  });

  it("falls back to zero when a center has no review summary", () => {
    expect(
      toCenter({
        ...center,
        rating: undefined,
        _count: { reviews: 0 },
      }),
    ).toMatchObject({
      rating: 0,
      reviews: 0,
    });
  });
});
