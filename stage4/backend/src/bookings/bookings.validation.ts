import { z } from "zod";

const positiveInteger = z.number().int().positive();

export const createBookingSchema = z
  .object({
    tripId: positiveInteger.optional(),
    courseId: positiveInteger.optional(),
    numberOfPeople: positiveInteger,
  })
  .strict()
  .superRefine((booking, context) => {
    const selectedExperienceCount = [
      booking.tripId,
      booking.courseId,
    ].filter((id) => id !== undefined).length;

    if (selectedExperienceCount !== 1) {
      context.addIssue({
        code: "custom",
        path: ["tripId"],
        message: "Choose either a trip or a course.",
      });
    }
  });

export const bookingIdParamsSchema = z
  .object({
    id: z.coerce.number().int().positive("Booking ID must be positive."),
  })
  .strict();

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
