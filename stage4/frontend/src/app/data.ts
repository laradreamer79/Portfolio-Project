export const CITIES = ["All Cities", "Jeddah", "Yanbu", "Dammam", "Al Khobar", "NEOM", "Jizan"];

export type Center = {
  id: number;
  name: string;
  city: string;
  description: string;
  longDescription: string;
  priceRange: string;
  rating: number;
  reviews: number;
  phone: string;
  email: string;
  address: string;
  img: string;
  gallery: string[];
  verified: boolean;
  status?: string;
  since: number;
  specialties: string[];
};

export type Trip = {
  id: number;
  centerId?: number | null;
  title: string;
  type: "trip" | "course";
  level: string;
  price: number;
  duration: string;
  depth: string;
  date: string;
  /** ISO date string (scheduleDate for trips, startDate for courses) used for past-date checks. */
  rawDate?: string;
  slots: number;
  description: string;
  img: string;
};

export type Review = {
  id: number;
  centerId: number;
  tripId?: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
};
