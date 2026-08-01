import { useEffect, useMemo, useState } from "react";
import { getInstructorBookings, type ApiBooking } from "../bookings";
import { useListingManagement } from "../listing-management";

export type InstructorDashboardTab =
  | "overview"
  | "bookings"
  | "listings"
  | "profile";

export type InstructorBookingRow = {
  id: string;
  listingId: number;
  listingType: "trip" | "course";
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
  const [allBookings, setAllBookings] = useState<InstructorBookingRow[]>([]);
  const [selectedListingKey, setSelectedListingKey] = useState("");

  useEffect(() => {
    if (!token) return;

    let active = true;
    const authToken = token;

    async function loadBookings() {
      try {
        const data = await getInstructorBookings(authToken);
        if (active) setAllBookings(data.map(toInstructorBookingRow));
      } catch {
        if (active) setAllBookings([]);
      }
    }

    void loadBookings();

    return () => {
      active = false;
    };
  }, [token]);

  const bookings = useMemo(
    () =>
      selectedListingKey
        ? allBookings.filter(
            (booking) =>
              `${booking.listingType}:${booking.listingId}` ===
              selectedListingKey,
          )
        : allBookings,
    [allBookings, selectedListingKey],
  );

  const listingManagement = useListingManagement({
    token,
    defaultSlots: 4,
    onEditComplete: () => setActiveTab("listings"),
  });

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
    pending,
    revenue,
    setActiveTab,
    selectedListingKey,
    setSelectedListingKey,
    viewListings,
    ...listingManagement,
  };
}

function toInstructorBookingRow(booking: ApiBooking): InstructorBookingRow {
  const listing = booking.trip ?? booking.course;
  const date = listing?.scheduleDate ?? listing?.startDate;

  return {
    id: `OYS-${String(booking.id).padStart(6, "0")}`,
    listingId: listing?.id ?? 0,
    listingType: booking.trip ? "trip" : "course",
    trip: listing?.title ?? "Deleted listing",
    customer: booking.user?.name ?? "Oyster user",
    email: booking.user?.email ?? "",
    phone: booking.user?.phone ?? booking.user?.email ?? "Not provided",
    divers: booking.numberOfPeople,
    total: Number(booking.totalPrice),
    date: date
      ? new Intl.DateTimeFormat("en", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date(date))
      : "Date TBA",
    status: booking.status,
  };
}
