import { z } from "zod";

const positiveInteger = z.number().int().positive();
const positiveIdParam = z.coerce.number().int().positive();

export const createReviewSchema = z
  .object({
    centerId: positiveInteger.optional(),
    tripId: positiveInteger.optional(),
    courseId: positiveInteger.optional(),
    rating: z
      .number()
      .int()
      .min(1, "Rating must be between 1 and 5.")
      .max(5, "Rating must be between 1 and 5."),
    comment: z.string().trim().min(1, "Review comment is required."),
  })
  .strict()
  .superRefine((review, context) => {
    const targetCount = [
      review.centerId,
      review.tripId,
      review.courseId,
    ].filter((id) => id !== undefined).length;

    if (targetCount !== 1) {
      context.addIssue({
        code: "custom",
        path: ["centerId"],
        message: "Provide exactly one of centerId, tripId, or courseId.",
      });
    }
  });

export const reviewIdParamsSchema = z
  .object({ id: positiveIdParam })
  .strict();

export const centerReviewParamsSchema = z
  .object({ centerId: positiveIdParam })
  .strict();

export const tripReviewParamsSchema = z
  .object({ tripId: positiveIdParam })
  .strict();

export const courseReviewParamsSchema = z
  .object({ courseId: positiveIdParam })
  .strict();

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
