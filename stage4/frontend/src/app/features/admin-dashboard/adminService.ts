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
  totalInstructors: number;
  pendingInstructors: number;
  totalBookings: number;
  confirmedBookings: number;
  totalReviews: number;
  totalRevenue: number;
};

export type InstructorApprovalStatus = "pending" | "approved" | "rejected";

export type AdminInstructor = {
  id: number;
  licenseNumber: string;
  city: string | null;
  status: InstructorApprovalStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
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

export function getAdminInstructors(token: string) {
  return apiRequest<AdminInstructor[]>("/admin/instructors", { token });
}

export function updateAdminInstructorStatus(
  id: number,
  status: InstructorApprovalStatus,
  token: string,
) {
  return apiRequest<AdminInstructor>(`/admin/instructors/${id}/status`, {
    method: "PATCH",
    body: { status },
    token,
  });
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
