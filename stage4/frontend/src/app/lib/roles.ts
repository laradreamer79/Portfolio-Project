export type UserRole = "user" | "instructor" | "diving_center" | "admin";
export type RegistrationRole = Exclude<UserRole, "admin">;

export const ROLE_LABELS: Record<UserRole, string> = {
  user: "Diver",
  instructor: "Instructor",
  diving_center: "Diving Center",
  admin: "Admin",
};

export function roleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}

export function dashboardPathForRole(role: UserRole): string {
  if (role === "admin") return "/admin";
  if (role === "instructor") return "/instructor/dashboard";
  if (role === "diving_center") return "/center/dashboard";
  return "/dashboard";
}
