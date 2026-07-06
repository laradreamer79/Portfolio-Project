import { apiRequest } from "./apiClient";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export type DivingCenter = {
  id: number;
  name: string;
  city: string;
  address: string | null;
  licenseNumber: string;
  description: string | null;
  priceRange: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: ApprovalStatus;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
};

export type Trip = {
  id: number;
  title: string;
  description: string | null;
  durationHours: number;
  difficultyLevel: DifficultyLevel;
  pricePerPerson: number;
  maxCapacity: number;
  scheduleDate: string;
  status: ApprovalStatus;
  centerId: number;
  instructorId: number | null;
  center?: DivingCenter;
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  id: number;
  title: string;
  description: string | null;
  level: string;
  price: number;
  startDate: string;
  status: ApprovalStatus;
  centerId: number;
  instructorId: number | null;
  center?: DivingCenter;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: number;
  rating: number;
  comment: string | null;
  userId: number;
  centerId: number;
  tripId: number | null;
  courseId: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CenterQuery = {
  city?: string;
  search?: string;
  verifiedOnly?: boolean;
};

export type TripQuery = {
  city?: string;
  level?: DifficultyLevel;
  search?: string;
  centerId?: number;
};

export type CourseQuery = {
  city?: string;
  level?: string;
  search?: string;
  centerId?: number;
};

export type ReviewPayload = {
  rating: number;
  comment: string;
  centerId: number;
  tripId?: number;
  courseId?: number;
};

export function getCenters(query: CenterQuery = {}): Promise<DivingCenter[]> {
  return apiRequest<DivingCenter[]>("/centers", { params: query });
}

export function getCenterById(id: number): Promise<DivingCenter> {
  return apiRequest<DivingCenter>(`/centers/${id}`);
}

export function getCenterReviews(centerId: number): Promise<Review[]> {
  return apiRequest<Review[]>(`/centers/${centerId}/reviews`);
}

export function getTrips(query: TripQuery = {}): Promise<Trip[]> {
  return apiRequest<Trip[]>("/trips", { params: query });
}

export function getTripById(id: number): Promise<Trip> {
  return apiRequest<Trip>(`/trips/${id}`);
}

export function getCourses(query: CourseQuery = {}): Promise<Course[]> {
  return apiRequest<Course[]>("/courses", { params: query });
}

export function getCourseById(id: number): Promise<Course> {
  return apiRequest<Course>(`/courses/${id}`);
}

export function submitReview(payload: ReviewPayload, token: string): Promise<Review> {
  return apiRequest<Review>("/reviews", {
    method: "POST",
    body: payload,
    token,
  });
}
