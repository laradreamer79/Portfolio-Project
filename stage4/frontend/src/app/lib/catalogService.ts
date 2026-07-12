import { CENTERS, type Center, type Review, type Trip } from "../data";
import { apiRequest } from "./apiClient";

const fallbackCenterImage =
  "https://images.unsplash.com/photo-1682687982298-c7514a167088?w=700&h=480&fit=crop&auto=format";
const fallbackTripImage =
  "https://images.unsplash.com/photo-1682687982360-3fbab65f9d50?w=500&h=340&fit=crop&auto=format";
const fallbackCourseImage =
  "https://images.unsplash.com/photo-1682687981630-cefe9cd73072?w=500&h=340&fit=crop&auto=format";

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

function queryString(filters: CatalogFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "All Cities" && value !== "All Levels") {
      params.set(key, value);
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

function fallbackCenter(center: ApiCenter) {
  return CENTERS.find(
    (candidate) =>
      candidate.id === center.id ||
      candidate.name.toLowerCase() === center.name.toLowerCase(),
  );
}

export function toCenter(center: ApiCenter): Center {
  const fallback = fallbackCenter(center);

  return {
    id: center.id,
    name: center.name,
    city: center.city,
    description:
      center.description ?? fallback?.description ?? "Explore diving experiences from this center.",
    longDescription:
      center.description ?? fallback?.longDescription ?? "Explore diving experiences, courses, and trips from this diving provider.",
    priceRange: center.priceRange ?? fallback?.priceRange ?? "Contact for pricing",
    rating: fallback?.rating ?? 4.8,
    reviews: center._count?.reviews ?? fallback?.reviews ?? 0,
    phone: center.contactPhone ?? fallback?.phone ?? "Not provided",
    email: center.contactEmail ?? fallback?.email ?? "Not provided",
    address: center.address ?? fallback?.address ?? center.city,
    img: center.imageUrl ?? fallback?.img ?? fallbackCenterImage,
    gallery: center.imageUrl ? [center.imageUrl] : fallback?.gallery ?? [],
    verified: center.status === "approved" || (fallback?.verified ?? true),
    since: center.createdAt ? new Date(center.createdAt).getFullYear() : fallback?.since ?? 2026,
    specialties: fallback?.specialties ?? ["Diving", "Trips", "Courses"],
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
    slots: trip.maxCapacity,
    description: trip.description ?? "Dive trip details will be shared by the provider.",
    img: trip.imageUrl ?? fallbackTripImage,
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
    slots: 12,
    description: course.description ?? "Course details will be shared by the provider.",
    img: course.imageUrl ?? fallbackCourseImage,
  };
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

export async function getCenters(filters: CatalogFilters = {}) {
  const centers = await apiRequest<ApiCenter[]>(
    `/centers${queryString({
      city: filters.city,
      search: filters.search,
    })}`,
  );

  return centers.map(toCenter);
}

export async function getTrips(filters: CatalogFilters = {}) {
  const trips = await apiRequest<ApiTrip[]>(
    `/trips${queryString({
      city: filters.city,
      search: filters.search,
      difficulty: filters.difficulty,
    })}`,
  );

  return trips.map(toTrip);
}

export async function getCourses(filters: CatalogFilters = {}) {
  const courses = await apiRequest<ApiCourse[]>(
    `/courses${queryString({
      city: filters.city,
      search: filters.search,
      level: filters.level,
    })}`,
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

export async function getTripById(id: number) {
  const trip = await apiRequest<ApiTrip & { reviews?: ApiReview[] }>(`/trips/${id}`);
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

export async function getCourseById(id: number) {
  const course = await apiRequest<ApiCourse & { reviews?: ApiReview[] }>(
    `/courses/${id}`,
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
