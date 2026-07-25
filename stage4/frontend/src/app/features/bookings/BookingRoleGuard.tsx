import { useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { canCreateBooking } from "./bookingAccess";

type BookingRoleGuardProps = {
  children: ReactNode;
};

export function BookingRoleGuard({ children }: BookingRoleGuardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hasShownMessage = useRef(false);
  const denied = Boolean(user && !canCreateBooking(user.role));

  useEffect(() => {
    if (!denied || hasShownMessage.current) return;

    hasShownMessage.current = true;
    window.alert("Only customer accounts can make bookings.");
    navigate("/", { replace: true });
  }, [denied, navigate]);

  return denied ? null : children;
}
