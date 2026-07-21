import { apiRequest } from "./apiClient";

export type ApiReview = {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
  userId: number;
  centerId?: number | null;
  tripId?: number | null;
  courseId?: number | null;
  user?: { id: number; name: string };
};

export type CreateReviewPayload = {
  centerId?: number;
  tripId?: number;
  courseId?: number;
  rating: number;
  comment: string;
};

/** Submits exactly one of centerId, tripId, or courseId along with a rating (1-5) and comment. */
export function submitReview(payload: CreateReviewPayload, token: string) {
  return apiRequest<ApiReview>("/reviews", {
    method: "POST",
    body: payload,
    token,
  });
}
