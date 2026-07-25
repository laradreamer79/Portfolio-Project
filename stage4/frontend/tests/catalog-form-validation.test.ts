import { describe, expect, it } from "vitest";
import { updateAdminProfileSchema } from "../src/app/features/admin-dashboard/adminValidation";
import {
  centerProfileSchema,
  validateCenterProfile,
  validateCenterProfileImage,
} from "../src/app/features/center-dashboard/centerProfileValidation";
import {
  validateListingForm,
  validateListingImage,
  type ListingForm,
} from "../src/app/features/listing-management/listingValidation";
import {
  reviewSchema,
  validateReview,
} from "../src/app/features/reviews/reviewValidation";
import {
  MAX_IMAGE_SIZE,
  dateInputSchema,
  todayInputValue,
  todayOrFutureDateSchema,
} from "../src/app/lib/validation";

const validImage = new File(["image"], "center.png", {
  type: "image/png",
});

const validListing: ListingForm = {
  title: "Farasan Reef",
  type: "trip",
  level: "Beginner",
  price: "350",
  duration: "Half Day",
  depth: "18m",
  date: todayInputValue(),
  slots: "8",
  description: "A guided reef diving trip.",
};

describe("admin profile form", () => {
  it("accepts a valid profile and rejects invalid names and emails", () => {
    expect(
      updateAdminProfileSchema.safeParse({
        name: "Lara Admin",
        email: "admin@example.com",
      }).success,
    ).toBe(true);
    expect(
      updateAdminProfileSchema.safeParse({
        name: "1",
        email: "invalid",
      }).success,
    ).toBe(false);
  });
});

describe("center profile form", () => {
  const validCenter = {
    name: "Jazan Diver",
    city: "Jazan",
    contactEmail: "center@example.com",
    contactPhone: "0512345678",
  };

  it("accepts valid profile fields and normalizes blank optional contacts", () => {
    expect(centerProfileSchema.safeParse(validCenter).success).toBe(true);
    expect(
      validateCenterProfile({
        ...validCenter,
        contactEmail: "",
        contactPhone: "",
      }),
    ).toEqual(
      expect.objectContaining({
        ok: true,
        data: expect.objectContaining({
          contactEmail: undefined,
          contactPhone: undefined,
        }),
      }),
    );
  });

  it.each([
    [{ ...validCenter, name: "123" }, "numeric-only name"],
    [{ ...validCenter, city: "Unknown City" }, "unknown city"],
    [{ ...validCenter, contactEmail: "invalid" }, "invalid email"],
    [{ ...validCenter, contactPhone: "123" }, "invalid phone"],
    [
      { ...validCenter, contactPhone: "+966512345678" },
      "international phone",
    ],
    [{ ...validCenter, contactPhone: "0412345678" }, "phone prefix"],
  ])("rejects a profile with %s", (profile) => {
    expect(centerProfileSchema.safeParse(profile).success).toBe(false);
  });
});

describe("trip and course listing forms", () => {
  it("accepts a complete trip listing and converts numeric fields", () => {
    const result = validateListingForm(validListing, {
      image: validImage,
      requiresImage: true,
    });

    expect(result).toEqual({
      ok: true,
      data: {
        title: "Farasan Reef",
        description: "A guided reef diving trip.",
        price: 350,
        slots: 8,
        date: todayInputValue(),
      },
    });
  });

  it.each([
    [{ ...validListing, title: "" }, "title"],
    [{ ...validListing, price: "-1" }, "price"],
    [{ ...validListing, slots: "0" }, "trip capacity"],
    [{ ...validListing, slots: "1.5" }, "whole trip capacity"],
    [{ ...validListing, description: "" }, "description"],
    [{ ...validListing, date: "not-a-date" }, "date"],
  ])("rejects an invalid listing %s", (listing) => {
    expect(
      validateListingForm(listing, {
        image: validImage,
        requiresImage: true,
      }).ok,
    ).toBe(false);
  });

  it("requires an image for a new listing", () => {
    expect(
      validateListingForm(validListing, {
        image: null,
        requiresImage: true,
      }),
    ).toEqual({
      ok: false,
      errors: {
        image: "Upload an image before publishing.",
      },
    });
  });

  it("allows zero slots for a course and the original past date while editing", () => {
    const pastDate = "2020-01-01";
    expect(
      validateListingForm(
        {
          ...validListing,
          type: "course",
          slots: "",
          date: pastDate,
        },
        {
          image: null,
          requiresImage: false,
          originalDate: pastDate,
        },
      ).ok,
    ).toBe(true);
  });

  it("rejects changing a listing to a past date", () => {
    expect(
      validateListingForm(
        { ...validListing, date: "2020-01-01" },
        {
          image: validImage,
          requiresImage: false,
          originalDate: "2030-01-01",
        },
      ).ok,
    ).toBe(false);
  });
});

describe("review form", () => {
  it("accepts a complete review and rejects invalid rating or comment", () => {
    expect(
      reviewSchema.safeParse({ rating: 5, comment: "Excellent trip" })
        .success,
    ).toBe(true);
    expect(validateReview(5, "Excellent trip")).toEqual({});
    expect(validateReview(0, "Excellent trip")).toEqual({
      rating: "Choose a rating between 1 and 5.",
    });
    expect(validateReview(5, " ")).toEqual({
      comment: "Enter a review comment.",
    });
  });
});

describe("shared image and date validation", () => {
  it("accepts supported images for center profiles and listings", () => {
    expect(validateCenterProfileImage(validImage)).toBeNull();
    expect(validateListingImage(validImage)).toBeNull();
  });

  it("rejects unsupported and oversized images", () => {
    const unsupported = new File(["text"], "notes.txt", {
      type: "text/plain",
    });
    const oversized = new File(
      [new Uint8Array(MAX_IMAGE_SIZE + 1)],
      "large.webp",
      { type: "image/webp" },
    );

    expect(validateCenterProfileImage(unsupported)).toBe(
      "Upload a JPEG, PNG, or WEBP image.",
    );
    expect(validateListingImage(oversized)).toBe(
      "The image must be 5 MB or smaller.",
    );
  });

  it("validates date input and future-date rules", () => {
    expect(dateInputSchema.safeParse("2030-12-20").success).toBe(true);
    expect(dateInputSchema.safeParse("20/12/2030").success).toBe(false);
    expect(todayOrFutureDateSchema.safeParse(todayInputValue()).success).toBe(
      true,
    );
    expect(todayOrFutureDateSchema.safeParse("2020-01-01").success).toBe(
      false,
    );
  });
});
