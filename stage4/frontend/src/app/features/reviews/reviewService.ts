import { apiRequest } from "../../lib/apiClient";

export type ApiReview = {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt?: string;
  userId?: number;
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

export function submitReview(payload: CreateReviewPayload, token: string) {
  return apiRequest<ApiReview>("/reviews", {
    method: "POST",
    body: payload,
    token,
  });
}

export function getAllReviews(token: string) {
  return apiRequest<ApiReview[]>("/reviews", {
    token,
  });
}

export function deleteReview(id: number, token: string) {
  return apiRequest(`/reviews/${id}`, {
    method: "DELETE",
    token,
  });
}
