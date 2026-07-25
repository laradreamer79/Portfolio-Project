import { apiRequest } from "../../lib/apiClient";

export type InstructorProfile = {
  licenseNumber: string;
  city?: string | null;
  status: string;
};

export function getInstructorProfile(token: string) {
  return apiRequest<InstructorProfile>("/instructors/me", { token });
}

export function updateInstructorProfile(city: string, token: string) {
  return apiRequest<InstructorProfile>("/instructors/me", {
    method: "PATCH",
    body: { city },
    token,
  });
}
