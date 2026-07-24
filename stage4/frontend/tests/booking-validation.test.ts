import { describe, expect, it } from "vitest";
import {
  bookingDetailsSchema,
  formatCardNumber,
  formatCvv,
  formatExpiry,
  paymentDetailsSchema,
  validateBookingDetails,
  validatePaymentDetails,
} from "../src/app/features/bookings/bookingValidation";
import { canCreateBooking } from "../src/app/features/bookings/bookingAccess";

function futureExpiry() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 2);
  return `${String(date.getMonth() + 1).padStart(2, "0")} / ${String(
    date.getFullYear() % 100,
  ).padStart(2, "0")}`;
}

describe("booking details form", () => {
  const validDetails = {
    name: "Lara Diver",
    email: "lara@example.com",
    phone: "0512345678",
    notes: "",
  };

  it("accepts valid contact details", () => {
    expect(bookingDetailsSchema.safeParse(validDetails).success).toBe(true);
    expect(validateBookingDetails(validDetails)).toBeNull();
  });

  it.each([
    [{ ...validDetails, name: "1" }, "name"],
    [{ ...validDetails, email: "invalid" }, "email"],
    [{ ...validDetails, phone: "12345" }, "Saudi phone"],
    [{ ...validDetails, phone: "+966512345678" }, "international phone"],
    [{ ...validDetails, phone: "0412345678" }, "phone prefix"],
  ])("rejects an invalid %s", (details) => {
    expect(bookingDetailsSchema.safeParse(details).success).toBe(false);
  });
});

describe("booking role access", () => {
  it("allows only customer users to create bookings", () => {
    expect(canCreateBooking("user")).toBe(true);
    expect(canCreateBooking("admin")).toBe(false);
    expect(canCreateBooking("instructor")).toBe(false);
    expect(canCreateBooking("diving_center")).toBe(false);
  });
});

describe("payment details form", () => {
  const validPayment = {
    card: "4111 1111 1111 1111",
    expiry: futureExpiry(),
    cvv: "123",
    holder: "Lara Diver",
  };

  it("accepts valid test-card details", () => {
    expect(paymentDetailsSchema.safeParse(validPayment).success).toBe(true);
    expect(validatePaymentDetails(validPayment)).toBeNull();
  });

  it.each([
    [{ ...validPayment, card: "4111 1111 1111 1112" }, "Luhn card"],
    [{ ...validPayment, card: "4111" }, "card length"],
    [{ ...validPayment, expiry: "01 / 20" }, "expired card"],
    [{ ...validPayment, expiry: "13 / 30" }, "expiry format"],
    [{ ...validPayment, cvv: "12A" }, "CVV"],
    [{ ...validPayment, cvv: "1234" }, "four-digit CVV"],
    [{ ...validPayment, holder: "123" }, "holder name"],
  ])("rejects an invalid %s", (payment) => {
    expect(paymentDetailsSchema.safeParse(payment).success).toBe(false);
  });

  it("formats card fields before validation", () => {
    expect(formatCardNumber("4111-1111-1111-1111x")).toBe(
      "4111 1111 1111 1111",
    );
    expect(formatExpiry("1230")).toBe("12 / 30");
    expect(formatCvv("12a345")).toBe("123");
  });
});
