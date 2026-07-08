export const ROLES = {
  USER: "user",
  INSTRUCTOR: "instructor",
  DIVING_CENTER: "diving_center",
  ADMIN: "admin",
} as const;


export type Role =
  (typeof ROLES)[keyof typeof ROLES];
