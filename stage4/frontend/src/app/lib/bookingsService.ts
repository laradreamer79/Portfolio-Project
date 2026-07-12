import { apiRequest } from "./apiClient";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

type ApiBookingTrip = {
  id: number;
  title: string;
  scheduleDate: string;
  durationHours: number;
  imageUrl?: string | null;
  centerId?: number | null;
  center?: { id: number; name: string; city: string } | null;
};

type ApiBookingCourse = {
  id: number;
  title: string;
  startDate: string;
  level: string;
  imageUrl?: string | null;
  centerId?: number | null;
  center?: { id: number; name: string; city: string } | null;
};

export type ApiBooking = {
  id: number;
  numberOfPeople: number;
  totalPrice: string | number;
  status: BookingStatus;
  createdAt: string;
  userId: number;
  tripId?: number | null;
  courseId?: number | null;
  trip?: ApiBookingTrip | null;
  course?: ApiBookingCourse | null;
};

export type CreateBookingPayload = {
  tripId?: number;
  courseId?: number;
  numberOfPeople: number;
};

export function createBooking(payload: CreateBookingPayload, token: string) {
  return apiRequest<ApiBooking>("/bookings", {
    method: "POST",
    body: payload,
    token,
  });
}

export function cancelBooking(id: number, token: string) {
  return apiRequest<ApiBooking>(`/bookings/${id}/cancel`, {
    method: "PATCH",
    token,
  });
}

export function getMyBookings(token: string) {
  return apiRequest<ApiBooking[]>("/bookings/my", { token });
}

export function getAllBookings(token: string) {
  return apiRequest<ApiBooking[]>("/bookings", { token });
}
