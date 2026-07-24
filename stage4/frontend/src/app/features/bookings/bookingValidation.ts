import { z } from "zod";
import {
  emailSchema,
  firstZodError,
  personNameSchema,
  saudiPhoneSchema,
} from "../../lib/validation";
import type { BookingFormState, PaymentFormState } from "./useBookingFlow";

export const bookingDetailsSchema = z.object({
  name: personNameSchema,
  email: emailSchema,
  phone: saudiPhoneSchema,
  notes: z.string(),
});

function passesLuhnCheck(cardDigits: string) {
  const checksum = [...cardDigits]
    .reverse()
    .reduce((sum, digit, index) => {
      const value = Number(digit);
      if (index % 2 === 0) return sum + value;
      const doubled = value * 2;
      return sum + (doubled > 9 ? doubled - 9 : doubled);
    }, 0);

  return checksum % 10 === 0;
}

const cardNumberSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .pipe(
    z
      .string()
      .length(16, "Card number must contain 16 digits.")
      .refine(passesLuhnCheck, "Enter a valid card number."),
  );

const expirySchema = z
  .string()
  .regex(/^(0[1-9]|1[0-2]) \/ (\d{2})$/, "Enter the expiry date as MM / YY.")
  .refine((expiry) => {
    const [, month, year] =
      expiry.match(/^(0[1-9]|1[0-2]) \/ (\d{2})$/) ?? [];
    if (!month || !year) return false;

    const expiryEnd = new Date(
      2000 + Number(year),
      Number(month),
      0,
      23,
      59,
      59,
      999,
    );
    return expiryEnd.getTime() >= Date.now();
  }, "The card expiry date has passed.");

export const paymentDetailsSchema = z.object({
  card: cardNumberSchema,
  expiry: expirySchema,
  cvv: z.string().regex(/^\d{3}$/, "CVV must contain 3 digits."),
  holder: z
  .string()
  .trim()
  .min(3, "Cardholder name must contain at least 3 characters.")
  .max(50, "Cardholder name must not exceed 50 characters.")
  .regex(
    /^[\p{L}\s]+$/u,
    "Cardholder name must contain letters only.",
  ),
});

export function validateBookingDetails(form: BookingFormState) {
  const result = bookingDetailsSchema.safeParse(form);
  return result.success ? null : firstZodError(result.error);
}

export function validatePaymentDetails(payment: PaymentFormState) {
  const result = paymentDetailsSchema.safeParse(payment);
  return result.success ? null : firstZodError(result.error);
}

export function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
    : digits;
}

export function formatCvv(value: string) {
  return value.replace(/\D/g, "").slice(0, 3);
}
