import type { Review } from "../../data";
import { toReview } from "./reviewMapper";
import { submitReview, type CreateReviewPayload } from "./reviewService";

type ReviewTarget = "center" | "trip" | "course";

type UseReviewSubmissionOptions = {
  token: string | null;
  target: ReviewTarget;
  targetId: number;
  onCreated: (review: Review) => void;
};

export function useReviewSubmission({
  token,
  target,
  targetId,
  onCreated,
}: UseReviewSubmissionOptions) {
  return async function handleReviewSubmit(rating: number, comment: string) {
    if (!token || !Number.isInteger(targetId)) return;

    const targetPayload: Pick<
      CreateReviewPayload,
      "centerId" | "tripId" | "courseId"
    > =
      target === "center"
        ? { centerId: targetId }
        : target === "trip"
          ? { tripId: targetId }
          : { courseId: targetId };

    const created = await submitReview(
      { ...targetPayload, rating, comment },
      token,
    );
    onCreated(toReview(created));
  };
}
