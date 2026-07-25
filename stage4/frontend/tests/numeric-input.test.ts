import { describe, expect, it } from "vitest";
import { decimalOnly, digitsOnly } from "../src/app/lib/validation";

describe("numeric input sanitizers", () => {
  it("keeps ASCII digits and removes letters and symbols", () => {
    expect(digitsOnly("05abc١٢3-45")).toBe("05345");
  });

  it("applies a maximum length after removing non-digits", () => {
    expect(digitsOnly("05 1234 56789", 10)).toBe("0512345678");
  });

  it("allows one decimal point while removing other characters", () => {
    expect(decimalOnly("12a.3.4e")).toBe("12.34");
  });
});
