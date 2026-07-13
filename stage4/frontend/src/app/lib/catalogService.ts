import type { Center, Review, Trip } from "../data";
import { apiRequest } from "./apiClient";

type ApiCount = {
  trips?: number;
  courses?: number;
  reviews?: number;
  bookings?: number;
};

export type ApiCenter = {
  id: number;
  name: string;
  city: string;
  address?: string | null;
  description?: string | null;
  priceRange?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  imageUrl?: string | null;
  status?: string;
  createdAt?: string;
  _count?: ApiCount;
  trips?: ApiTrip[];
  courses?: ApiCourse[];
  reviews?: ApiReview[];
};

export type ApiTrip = {
  id: number;
  title: string;
  description?: string | null;
  durationHours: number;
  difficultyLevel: "beginner" | "intermediate" | "advanced" | string;
  pricePerPerson: string | number;
  maxCapacity: number;
  scheduleDate: string;
  centerId?: number | null;
  instructorId?: number | null;
  imageUrl?: string | null;
  center?: Pick<ApiCenter, "id" | "name" | "city"> | null;
  _count?: ApiCount;
};

export type ApiCourse = {
  id: number;
  title: string;
  description?: string | null;
  level: string;
  price: string | number;
  startDate: string;
  centerId?: number | null;
  instructorId?: number | null;
  imageUrl?: string | null;
  center?: Pick<ApiCenter, "id" | "name" | "city"> | null;
  _count?: ApiCount;
};

export type ApiReview = {
  id: number;
  centerId?: number | null;
  tripId?: number | null;
  courseId?: number | null;
  rating: number;
  comment?: string | null;
  createdAt?: string;
  user?: {
    id: number;
    name: string;
  };
};

type CatalogFilters = {
  city?: string;
  search?: string;
  difficulty?: string;
  level?: string;
  status?: string;
  ownerId?: number;
};

export type CreateTripPayload = {
  title: string;
  description?: string;
  durationHours: number;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  pricePerPerson: number;
  maxCapacity: number;
  scheduleDate: string;
  image: File;
};

export type CreateCoursePayload = {
  title: string;
  description?: string;
  level: string;
  price: number;
  startDate: string;
  image: File;
};

// ---- Fallback images (used when the backend has no imageUrl for a record) ----
const FALLBACK_CENTER_IMAGES = [
  "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&auto=format",
];

const FALLBACK_TRIP_IMAGES = [
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format",
];

const FALLBACK_COURSE_IMAGES = [
  "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1553969923-bb45169a705d?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=800&h=600&fit=crop&auto=format",
];

function pickFallback(images: string[], id: number) {
  const index = Math.abs(id) % images.length;
  return images[index];
}

function resolveImage(
  imageUrl: string | null | undefined,
  id: number,
  images: string[],
) {
  return imageUrl && imageUrl.trim() !== "" ? imageUrl : pickFallback(images, id);
}

function queryString(filters: CatalogFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "All Cities" && value !== "All Levels") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `?${query}` : "";
}

function formatDate(value?: string) {
  if (!value) return "Date TBA";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatLevel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function toCenter(center: ApiCenter): Center {
  const img = resolveImage(center.imageUrl, center.id, FALLBACK_CENTER_IMAGES);
  return {
    id: center.id,
    name: center.name,
    city: center.city,
    description:
      center.description ?? "Explore diving experiences from this center.",
    longDescription:
      center.description ?? "Explore diving experiences, courses, and trips from this diving provider.",
    priceRange: center.priceRange ?? "Contact for pricing",
    rating: 0,
    reviews: center._count?.reviews ?? 0,
    phone: center.contactPhone ?? "Not provided",
    email: center.contactEmail ?? "Not provided",
    address: center.address ?? center.city,
    img,
    gallery: [img],
    verified: center.status === "approved",
    since: center.createdAt ? new Date(center.createdAt).getFullYear() : 2026,
    specialties: ["Diving", "Trips", "Courses"],
  };
}

export function toTrip(trip: ApiTrip): Trip {
  return {
    id: trip.id,
    centerId: trip.centerId,
    title: trip.title,
    type: "trip",
    level: formatLevel(trip.difficultyLevel),
    price: Number(trip.pricePerPerson),
    duration: `${trip.durationHours} Hours`,
    depth: "Varies",
    date: formatDate(trip.scheduleDate),
    rawDate: trip.scheduleDate,
    slots: trip.maxCapacity,
    description: trip.description ?? "Dive trip details will be shared by the provider.",
    img: resolveImage(trip.imageUrl, trip.id, FALLBACK_TRIP_IMAGES),
  };
}

export function toCourse(course: ApiCourse): Trip {
  return {
    id: course.id,
    centerId: course.centerId,
    title: course.title,
    type: "course",
    level: course.level,
    price: Number(course.price),
    duration: "Course",
    depth: "Training",
    date: formatDate(course.startDate),
    rawDate: course.startDate,
    slots: 12,
    description: course.description ?? "Course details will be shared by the provider.",
    img: resolveImage(course.imageUrl, course.id, FALLBACK_COURSE_IMAGES),
  };
}

/** True when the trip/course's scheduled date has already passed. */
export function isPastExperience(experience: Pick<Trip, "rawDate">): boolean {
  if (!experience.rawDate) return false;
  const scheduled = new Date(experience.rawDate);
  if (Number.isNaN(scheduled.getTime())) return false;
  const endOfScheduledDay = new Date(scheduled);
  endOfScheduledDay.setHours(23, 59, 59, 999);
  return endOfScheduledDay.getTime() < Date.now();
}

/**
 * Fetches a trip or course by id without knowing the type upfront.
 * Tries the trips endpoint first, then falls back to courses.
 */
export async function getExperienceById(
  type: "trip" | "course",
  id: number,
) {
  return type === "course" ? getCourseById(id) : getTripById(id);
}

export function toReview(review: ApiReview): Review {
  return {
    id: review.id,
    centerId: review.centerId ?? 0,
    tripId: review.tripId ?? review.courseId ?? undefined,
    user: review.user?.name ?? "Oyster user",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&auto=format",
    rating: review.rating,
    date: review.createdAt ? formatDate(review.createdAt) : "Recently",
    comment: review.comment ?? "",
  };
}

export async function getCenters(filters: CatalogFilters = {}, token?: string | null) {
  const centers = await apiRequest<ApiCenter[]>(
    `/centers${queryString({
      city: filters.city,
      search: filters.search,
      status: filters.status,
      ownerId: filters.ownerId,
    })}`,
    { token },
  );

  return centers.map(toCenter);
}

export async function getTrips(filters: CatalogFilters = {}, token?: string | null) {
  const trips = await apiRequest<ApiTrip[]>(
    `/trips${queryString({
      city: filters.city,
      search: filters.search,
      difficulty: filters.difficulty,
      status: filters.status,
    })}`,
    { token },
  );

  return trips.map(toTrip);
}

export async function getCourses(filters: CatalogFilters = {}, token?: string | null) {
  const courses = await apiRequest<ApiCourse[]>(
    `/courses${queryString({
      city: filters.city,
      search: filters.search,
      level: filters.level,
      status: filters.status,
    })}`,
    { token },
  );

  return courses.map(toCourse);
}

export async function getCenterById(id: number) {
  const center = await apiRequest<ApiCenter>(`/centers/${id}`);
  return {
    center: toCenter(center),
    trips: center.trips?.map(toTrip) ?? [],
    courses: center.courses?.map(toCourse) ?? [],
    reviews: center.reviews?.map(toReview) ?? [],
  };
}

export async function getTripById(id: number, token?: string | null) {
  const trip = await apiRequest<ApiTrip & { reviews?: ApiReview[] }>(
    `/trips/${id}`,
    { token },
  );
  return {
    trip: toTrip(trip),
    center: trip.center
      ? toCenter({
          id: trip.center.id,
          name: trip.center.name,
          city: trip.center.city,
        })
      : undefined,
    reviews: trip.reviews?.map(toReview) ?? [],
  };
}

export async function getCourseById(id: number, token?: string | null) {
  const course = await apiRequest<ApiCourse & { reviews?: ApiReview[] }>(
    `/courses/${id}`,
    { token },
  );

  return {
    course: toCourse(course),
    center: course.center
      ? toCenter({
          id: course.center.id,
          name: course.center.name,
          city: course.center.city,
        })
      : undefined,
    reviews: course.reviews?.map(toReview) ?? [],
  };
}

export async function createTrip(payload: CreateTripPayload, token: string) {
  const { image, ...data } = payload;
  const trip = await apiRequest<ApiTrip>("/trips", {
    method: "POST",
    body: toCatalogFormData(data, image),
    token,
  });

  return toTrip(trip);
}

export async function createCourse(
  payload: CreateCoursePayload,
  token: string,
) {
  const { image, ...data } = payload;
  const course = await apiRequest<ApiCourse>("/courses", {
    method: "POST",
    body: toCatalogFormData(data, image),
    token,
  });

  return toCourse(course);
}

function toCatalogFormData(
  data: Record<string, string | number | undefined>,
  image: File,
) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  formData.append("image", image);
  return formData;
}
