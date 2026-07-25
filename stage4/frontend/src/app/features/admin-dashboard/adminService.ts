import { apiRequest } from "../../lib/apiClient";
import type { UserRole } from "../../lib/roles";
import {
  updateAdminProfileSchema,
  type UpdateAdminProfileInput,
} from "./adminValidation";

export type AdminDashboardSummary = {
  totalUsers: number;
  totalCenters: number;
  pendingCenters: number;
  totalBookings: number;
  confirmedBookings: number;
  totalReviews: number;
  totalRevenue: number;
};

export type AdminProfile = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export function getAdminDashboard(token: string) {
  return apiRequest<AdminDashboardSummary>("/admin/dashboard", {
    token,
  });
}

export function getAdminProfile(token: string) {
  return apiRequest<AdminProfile>("/admin/profile", { token });
}

export function updateAdminProfile(
  payload: UpdateAdminProfileInput,
  token: string,
) {
  const data = updateAdminProfileSchema.parse(payload);

  return apiRequest<AdminProfile>("/admin/profile", {
    method: "PATCH",
    body: data,
    token,
  });
}
