import { z } from "zod";
import { firstZodError } from "../../lib/validation";

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Choose a rating between 1 and 5.")
    .max(5, "Choose a rating between 1 and 5."),
  comment: z.string().trim().min(1, "Enter a review comment."),
});

export function validateReview(rating: number, comment: string) {
  const result = reviewSchema.safeParse({ rating, comment });
  return result.success ? null : firstZodError(result.error);
}
