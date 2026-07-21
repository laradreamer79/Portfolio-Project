import { useMemo, useState } from "react";
import { useListingManagement } from "../listing-management";

export type InstructorDashboardTab =
  | "overview"
  | "bookings"
  | "listings"
  | "profile";

export type InstructorBookingRow = {
  id: string;
  trip: string;
  customer: string;
  email: string;
  phone: string;
  divers: number;
  total: number;
  date: string;
  status: string;
};

export function useInstructorDashboard(token: string | null) {
  const [activeTab, setActiveTab] =
    useState<InstructorDashboardTab>("overview");
  const [bookings, setBookings] = useState<InstructorBookingRow[]>([]);

  const listingManagement = useListingManagement({
    token,
    defaultSlots: 4,
    onEditComplete: () => setActiveTab("listings"),
  });

  function confirmBooking(id: string) {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id ? { ...booking, status: "confirmed" } : booking,
      ),
    );
  }

  function declineBooking(id: string) {
    setBookings((current) =>
      current.filter((booking) => booking.id !== id),
    );
  }

  function viewListings() {
    listingManagement.closePostModal();
    setActiveTab("listings");
  }

  const revenue = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === "confirmed")
        .reduce((sum, booking) => sum + booking.total, 0),
    [bookings],
  );
  const pending = useMemo(
    () =>
      bookings.filter((booking) => booking.status === "pending").length,
    [bookings],
  );

  return {
    activeTab,
    bookings,
    confirmBooking,
    declineBooking,
    pending,
    revenue,
    setActiveTab,
    viewListings,
    ...listingManagement,
  };
}
