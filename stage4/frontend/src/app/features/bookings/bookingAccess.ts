import type { UserRole } from "../../lib/roles";

export function canCreateBooking(role: UserRole) {
  return role === "user";
}
