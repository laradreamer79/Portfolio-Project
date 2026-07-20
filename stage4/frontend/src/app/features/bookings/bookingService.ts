import { apiRequest } from "../../lib/apiClient";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

type ApiBookingListing = {
  id: number;
  title: string;
  pricePerPerson?: string | number;
  price?: string | number;
  durationHours?: number;
  difficultyLevel?: string;
  level?: string;
  scheduleDate?: string;
  startDate?: string;
  imageUrl?: string | null;
  centerId?: number | null;
  center?: {
    id: number;
    name: string;
    city: string;
  } | null;
};

export type ApiBooking = {
  id: number;
  userId?: number;
  tripId?: number | null;
  courseId?: number | null;
  numberOfPeople: number;
  totalPrice: string | number;
  status: BookingStatus | string;
  createdAt?: string;
  trip?: ApiBookingListing | null;
  course?: ApiBookingListing | null;
  user?: {
    id: number;
    name: string;
    email?: string;
  } | null;
};

export type BookingCard = {
  id: number;
  reference: string;
  listingId: number;
  listingType: "trip" | "course";
  title: string;
  centerName: string;
  city: string;
  customer: string;
  date: string;
  duration: string;
  divers: number;
  total: number;
  status: string;
  img: string;
};

export type CreateBookingPayload = {
  tripId?: number;
  courseId?: number;
  numberOfPeople: number;
};

function formatDate(value?: string) {
  if (!value) return "Date TBA";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function toBookingCard(booking: ApiBooking): BookingCard {
  const listing = booking.trip ?? booking.course;
  const listingType = booking.trip ? "trip" : "course";

  return {
    id: booking.id,
    reference: `OYS-${String(booking.id).padStart(6, "0")}`,
    listingId: listing?.id ?? 0,
    listingType,
    title: listing?.title ?? "Deleted listing",
    centerName: listing?.center?.name ?? "Independent Instructor",
    city: listing?.center?.city ?? "Oyster",
    customer: booking.user?.name ?? "Oyster user",
    date: formatDate(listing?.scheduleDate ?? listing?.startDate),
    duration: listing?.durationHours ? `${listing.durationHours} Hours` : "Course",
    divers: booking.numberOfPeople,
    total: Number(booking.totalPrice),
    status: booking.status,
    img: listing?.imageUrl ?? "",
  };
}

export async function getMyBookings(token: string) {
  return apiRequest<ApiBooking[]>("/bookings/my", { token });
}

export async function getAllBookings(token: string) {
  const bookings = await apiRequest<ApiBooking[]>("/bookings", { token });
  return bookings.map(toBookingCard);
}

export async function createBooking(
  payload: CreateBookingPayload,
  token: string,
) {
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
