import { useEffect, useMemo, useState } from "react";
import type { Center } from "../../data";
import { getAllBookings, type BookingCard } from "../bookings";
import { getCenters } from "../catalog";

export type AdminTab = "overview" | "centers" | "bookings" | "reviews";
export type CenterStatus = "active" | "pending" | "suspended";

export type CenterRow = Center & {
  status: CenterStatus;
};

export type ReviewRow = {
  id: number;
  centerId: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
};

export const ADMIN_TABS: ReadonlyArray<{
  key: AdminTab;
  label: string;
}> = [
  { key: "overview", label: "Overview" },
  { key: "centers", label: "Centers" },
  { key: "bookings", label: "Bookings" },
  { key: "reviews", label: "Reviews" },
];

export function useAdminDashboard(token: string | null) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [centers, setCenters] = useState<CenterRow[]>([]);
  const [bookings, setBookings] = useState<BookingCard[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [centerQuery, setCenterQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CenterStatus | "all">("all");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;

    getCenters({ status: "all" }, token)
      .then((centerData) => {
        if (!active) return;
        setCenters(
          centerData.map((center) => ({
            ...center,
            status: center.verified ? "active" : "pending",
          })),
        );
      })
      .catch(() => {
        if (active) setCenters([]);
      });

    getAllBookings(token)
      .then((bookingData) => {
        if (active) setBookings(bookingData);
      })
      .catch(() => {
        if (active) setBookings([]);
      });

    return () => {
      active = false;
    };
  }, [token]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  function verifyCenter(id: number) {
    setCenters((current) =>
      current.map((center) =>
        center.id === id
          ? { ...center, status: "active", verified: true }
          : center,
      ),
    );
    showToast("Center verified and activated.");
  }

  function suspendCenter(id: number) {
    setCenters((current) =>
      current.map((center) =>
        center.id === id ? { ...center, status: "suspended" } : center,
      ),
    );
    showToast("Center suspended.");
  }

  function removeReview(id: number) {
    setReviews((current) => current.filter((review) => review.id !== id));
    showToast("Review removed.");
  }

  const filteredCenters = useMemo(() => {
    const normalizedQuery = centerQuery.trim().toLowerCase();

    return centers.filter((center) => {
      const matchesQuery =
        !normalizedQuery ||
        center.name.toLowerCase().includes(normalizedQuery) ||
        center.city.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" || center.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [centerQuery, centers, statusFilter]);

  const totalRevenue = useMemo(
    () => bookings.reduce((sum, booking) => sum + booking.total, 0),
    [bookings],
  );
  const pendingCount = useMemo(
    () => centers.filter((center) => center.status === "pending").length,
    [centers],
  );

  return {
    activeTab,
    bookings,
    centerQuery,
    centers,
    filteredCenters,
    pendingCount,
    removeReview,
    reviews,
    setActiveTab,
    setCenterQuery,
    setStatusFilter,
    statusFilter,
    suspendCenter,
    toast,
    totalRevenue,
    verifyCenter,
  };
}
