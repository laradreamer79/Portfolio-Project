import type { Review } from "../../data";
import type { ApiReview } from "./reviewService";

const fallbackAvatar =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&auto=format";

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function toReview(review: ApiReview): Review {
  return {
    id: review.id,
    centerId: review.centerId ?? 0,
    tripId: review.tripId ?? review.courseId ?? undefined,
    user: review.user?.name ?? "Oyster user",
    avatar: fallbackAvatar,
    rating: review.rating,
    date: review.createdAt ? formatReviewDate(review.createdAt) : "Recently",
    comment: review.comment ?? "",
  };
}
