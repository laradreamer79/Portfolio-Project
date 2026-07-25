import { describe, expect, it } from "vitest";
import { updateAdminProfileSchema } from "../src/admin/admin.validation.js";
import {
  loginSchema,
  registerSchema,
} from "../src/auth/auth.validation.js";
import {
  bookingIdParamsSchema,
  createBookingSchema,
} from "../src/bookings/bookings.validation.js";
import {
  centerCreateSchema,
  centerIdParamsSchema,
  centerQuerySchema,
  centerUpdateSchema,
} from "../src/centers/centers.validation.js";
import {
  courseCreateSchema,
  courseIdParamsSchema,
  courseQuerySchema,
  courseUpdateSchema,
} from "../src/courses/courses.validation.js";
import { updateInstructorProfileSchema } from "../src/instructors/instructors.validation.js";
import {
  createPaymentSchema,
  moyasarWebhookSchema,
  paymentIdParamsSchema,
} from "../src/payments/payments.validation.js";
import {
  centerReviewParamsSchema,
  courseReviewParamsSchema,
  createReviewSchema,
  reviewIdParamsSchema,
  tripReviewParamsSchema,
} from "../src/reviews/reviews.validation.js";
import {
  tripCreateSchema,
  tripIdParamsSchema,
  tripQuerySchema,
  tripUpdateSchema,
} from "../src/trips/trips.validation.js";

const validUser = {
  name: "Lara Diver",
  email: "lara@example.com",
  phone: "0512345678",
  password: "password123",
  role: "user" as const,
};

const validCenterRegistration = {
  ...validUser,
  role: "diving_center" as const,
  centerName: "Jazan Diver 360",
  centerCity: "Jazan",
  centerLicenseNumber: "12345",
};

const validCenter = {
  name: "Jazan Diver",
  city: "Jazan",
  address: "Corniche Road",
  licenseNumber: "12345",
  description: "A professional diving center.",
  priceRange: "SAR 200-500",
  contactEmail: "center@example.com",
  contactPhone: "0512345678",
};

const validTrip = {
  title: "Farasan Reef",
  description: "A guided reef diving trip.",
  durationHours: "4",
  difficultyLevel: "beginner",
  pricePerPerson: "350",
  maxCapacity: "8",
  scheduleDate: "2030-07-30",
  centerId: 1,
};

const validCourse = {
  title: "Open Water Course",
  description: "Learn the basics of safe scuba diving.",
  level: "Beginner",
  price: "1200",
  startDate: "2030-08-01",
  instructorId: 2,
};

describe("auth form validation", () => {
  it("accepts a valid public user registration", () => {
    expect(registerSchema.safeParse(validUser).success).toBe(true);
  });

  it.each([
    [{ ...validUser, name: "1" }, "invalid name"],
    [{ ...validUser, email: "not-an-email" }, "invalid email"],
    [{ ...validUser, phone: "12345" }, "invalid phone"],
    [{ ...validUser, phone: "+966512345678" }, "international phone"],
    [{ ...validUser, password: "short" }, "short password"],
    [{ ...validUser, password: "x".repeat(73) }, "long password"],
  ])("rejects %s", (payload) => {
    expect(registerSchema.safeParse(payload).success).toBe(false);
  });

  it("validates instructor-specific registration fields", () => {
    const validInstructor = {
      ...validUser,
      role: "instructor",
      instructorLicenseNumber: "98765",
      instructorCity: "Jeddah",
    };

    expect(registerSchema.safeParse(validInstructor).success).toBe(true);
    expect(
      registerSchema.safeParse({
        ...validInstructor,
        instructorLicenseNumber: "ABC",
      }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        ...validInstructor,
        instructorCity: "Unknown City",
      }).success,
    ).toBe(false);
  });

  it("validates diving-center-specific registration fields", () => {
    expect(registerSchema.safeParse(validCenterRegistration).success).toBe(
      true,
    );
    expect(
      registerSchema.safeParse({
        ...validCenterRegistration,
        centerName: "12345",
      }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        ...validCenterRegistration,
        centerLicenseNumber: "SA-123",
      }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        ...validCenterRegistration,
        centerCity: "",
      }).success,
    ).toBe(false);
  });

  it("accepts Arabic letters in a diving-center name", () => {
    expect(
      registerSchema.safeParse({
        ...validCenterRegistration,
        centerName: "مركز الغوص 360",
      }).success,
    ).toBe(true);
  });

  it("requires a valid login email and a non-empty password", () => {
    expect(
      loginSchema.safeParse({
        email: "lara@example.com",
        password: "existing-password",
      }).success,
    ).toBe(true);
    expect(
      loginSchema.safeParse({ email: "invalid", password: "" }).success,
    ).toBe(false);
  });
});

describe("center form and filter validation", () => {
  it("accepts a complete center form", () => {
    expect(centerCreateSchema.safeParse(validCenter).success).toBe(true);
  });

  it.each([
    [{ ...validCenter, name: "123" }, "numeric-only name"],
    [{ ...validCenter, city: "Unknown City" }, "unknown city"],
    [{ ...validCenter, address: " " }, "blank address"],
    [{ ...validCenter, contactEmail: "invalid" }, "invalid email"],
    [{ ...validCenter, contactPhone: "123" }, "invalid phone"],
    [
      { ...validCenter, contactPhone: "+966512345678" },
      "international phone",
    ],
    [{ ...validCenter, contactPhone: "0412345678" }, "phone prefix"],
  ])("rejects a center with %s", (payload) => {
    expect(centerCreateSchema.safeParse(payload).success).toBe(false);
  });

  it("accepts valid partial center updates and rejects unknown fields", () => {
    expect(
      centerUpdateSchema.safeParse({
        city: "Yanbu",
        status: "approved",
      }).success,
    ).toBe(true);
    expect(
      centerUpdateSchema.safeParse({ unsupported: true }).success,
    ).toBe(false);
  });

  it("validates center query parameters and route IDs", () => {
    expect(
      centerQuerySchema.safeParse({
        city: "Jazan",
        status: "all",
        ownerId: "4",
      }).success,
    ).toBe(true);
    expect(
      centerQuerySchema.safeParse({ status: "unknown" }).success,
    ).toBe(false);
    expect(centerIdParamsSchema.safeParse({ id: "3" }).success).toBe(true);
    expect(centerIdParamsSchema.safeParse({ id: "0" }).success).toBe(false);
  });
});

describe("trip form and filter validation", () => {
  it("accepts and coerces a complete trip form", () => {
    const result = tripCreateSchema.safeParse(validTrip);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.durationHours).toBe(4);
      expect(result.data.pricePerPerson).toBe(350);
      expect(result.data.scheduleDate).toBeInstanceOf(Date);
    }
  });

  it.each([
    [{ ...validTrip, title: " " }, "blank title"],
    [{ ...validTrip, durationHours: 0 }, "zero duration"],
    [{ ...validTrip, difficultyLevel: "expert" }, "unknown difficulty"],
    [{ ...validTrip, pricePerPerson: -1 }, "negative price"],
    [{ ...validTrip, maxCapacity: 1.5 }, "fractional capacity"],
    [{ ...validTrip, scheduleDate: "not-a-date" }, "invalid date"],
  ])("rejects a trip with %s", (payload, _caseName) => {
    expect(tripCreateSchema.safeParse(payload).success).toBe(false);
  });

  it("allows partial ownership updates", () => {
    expect(
      tripUpdateSchema.safeParse({
        title: "Updated title",
        centerId: null,
        instructorId: 5,
      }).success,
    ).toBe(true);
  });

  it("validates trip filters and IDs", () => {
    expect(
      tripQuerySchema.safeParse({
        city: "Jeddah",
        difficulty: "advanced",
        minPrice: "100",
        maxPrice: "500",
      }).success,
    ).toBe(true);
    expect(
      tripQuerySchema.safeParse({
        minPrice: "500",
        maxPrice: "100",
      }).success,
    ).toBe(false);
    expect(tripIdParamsSchema.safeParse({ id: "abc" }).success).toBe(false);
  });
});

describe("course form and filter validation", () => {
  it("accepts and coerces a complete course form", () => {
    const result = courseCreateSchema.safeParse(validCourse);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(1200);
      expect(result.data.startDate).toBeInstanceOf(Date);
    }
  });

  it.each([
    [{ ...validCourse, title: "" }, "blank title"],
    [{ ...validCourse, description: " " }, "blank description"],
    [{ ...validCourse, level: "" }, "blank level"],
    [{ ...validCourse, price: -1 }, "negative price"],
    [{ ...validCourse, startDate: "invalid" }, "invalid date"],
  ])("rejects a course with %s", (payload, _caseName) => {
    expect(courseCreateSchema.safeParse(payload).success).toBe(false);
  });

  it("allows partial course updates", () => {
    expect(
      courseUpdateSchema.safeParse({
        price: "900",
        centerId: null,
      }).success,
    ).toBe(true);
  });

  it("validates course filters and IDs", () => {
    expect(
      courseQuerySchema.safeParse({
        level: "Beginner",
        centerId: "2",
        minPrice: "0",
      }).success,
    ).toBe(true);
    expect(
      courseQuerySchema.safeParse({ search: "" }).success,
    ).toBe(false);
    expect(courseIdParamsSchema.safeParse({ id: "0" }).success).toBe(false);
  });
});

describe("booking form validation", () => {
  it("accepts exactly one valid booking target", () => {
    expect(
      createBookingSchema.safeParse({
        tripId: 1,
        numberOfPeople: 2,
      }).success,
    ).toBe(true);
    expect(
      createBookingSchema.safeParse({
        courseId: 2,
        numberOfPeople: 1,
      }).success,
    ).toBe(true);
  });

  it("rejects missing or multiple targets and invalid people counts", () => {
    expect(
      createBookingSchema.safeParse({ numberOfPeople: 1 }).success,
    ).toBe(false);
    expect(
      createBookingSchema.safeParse({
        tripId: 1,
        courseId: 2,
        numberOfPeople: 1,
      }).success,
    ).toBe(false);
    expect(
      createBookingSchema.safeParse({
        tripId: 1,
        numberOfPeople: 1.5,
      }).success,
    ).toBe(false);
  });

  it("validates booking route IDs", () => {
    expect(bookingIdParamsSchema.safeParse({ id: "8" }).success).toBe(true);
    expect(bookingIdParamsSchema.safeParse({ id: "-1" }).success).toBe(
      false,
    );
  });
});

describe("review form validation", () => {
  it.each(["centerId", "tripId", "courseId"])(
    "accepts a review with only %s",
    (target) => {
      expect(
        createReviewSchema.safeParse({
          [target]: 1,
          rating: 5,
          comment: "Great experience",
        }).success,
      ).toBe(true);
    },
  );

  it("rejects invalid targets, ratings, and comments", () => {
    expect(
      createReviewSchema.safeParse({
        tripId: 1,
        courseId: 2,
        rating: 5,
        comment: "Great",
      }).success,
    ).toBe(false);
    expect(
      createReviewSchema.safeParse({
        tripId: 1,
        rating: 6,
        comment: "Great",
      }).success,
    ).toBe(false);
    expect(
      createReviewSchema.safeParse({
        tripId: 1,
        rating: 5,
        comment: " ",
      }).success,
    ).toBe(false);
  });

  it("validates every review route parameter", () => {
    expect(reviewIdParamsSchema.safeParse({ id: "1" }).success).toBe(true);
    expect(
      centerReviewParamsSchema.safeParse({ centerId: "2" }).success,
    ).toBe(true);
    expect(
      tripReviewParamsSchema.safeParse({ tripId: "3" }).success,
    ).toBe(true);
    expect(
      courseReviewParamsSchema.safeParse({ courseId: "4" }).success,
    ).toBe(true);
    expect(
      courseReviewParamsSchema.safeParse({ courseId: "invalid" }).success,
    ).toBe(false);
  });
});

describe("payment form and webhook validation", () => {
  it("accepts valid payment requests and rejects invalid input", () => {
    expect(
      createPaymentSchema.safeParse({
        bookingId: 1,
        paymentMethod: "creditcard",
        sourceToken: "tok_test",
      }).success,
    ).toBe(true);
    expect(
      createPaymentSchema.safeParse({
        bookingId: 0,
        paymentMethod: "",
      }).success,
    ).toBe(false);
  });

  it("validates payment route IDs", () => {
    expect(paymentIdParamsSchema.safeParse({ id: "7" }).success).toBe(true);
    expect(paymentIdParamsSchema.safeParse({ id: "x" }).success).toBe(
      false,
    );
  });

  it("accepts a valid Moyasar webhook and rejects incomplete data", () => {
    expect(
      moyasarWebhookSchema.safeParse({
        type: "payment_paid",
        data: {
          id: "pay_test",
          status: "paid",
          amount: 10000,
          currency: "SAR",
        },
      }).success,
    ).toBe(true);
    expect(
      moyasarWebhookSchema.safeParse({
        type: "",
        data: { id: "", status: "" },
      }).success,
    ).toBe(false);
  });
});

describe("profile form validation", () => {
  it("validates admin profile updates", () => {
    expect(updateAdminProfileSchema.safeParse({}).success).toBe(false);
    expect(
      updateAdminProfileSchema.safeParse({ email: "invalid-email" })
        .success,
    ).toBe(false);
    expect(
      updateAdminProfileSchema.safeParse({ name: "Updated Admin" })
        .success,
    ).toBe(true);
  });

  it("validates instructor city updates", () => {
    expect(
      updateInstructorProfileSchema.safeParse({ city: "Jeddah" }).success,
    ).toBe(true);
    expect(
      updateInstructorProfileSchema.safeParse({ city: "Unknown City" })
        .success,
    ).toBe(false);
    expect(
      updateInstructorProfileSchema.safeParse({
        city: "Jeddah",
        extra: true,
      }).success,
    ).toBe(false);
  });
});
