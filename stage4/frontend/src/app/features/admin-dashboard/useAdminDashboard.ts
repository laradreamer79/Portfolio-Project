import { useEffect, useMemo, useState } from "react";
import type { Center } from "../../data";
import { getAllBookings, type BookingCard } from "../bookings";
import { getCenters, updateCenterStatus } from "../catalog";
import { deleteReview, getAllReviews, toReview } from "../reviews";

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

  function toCenterStatus(status?: string): CenterStatus {
    if (status === "approved") return "active";
    if (status === "rejected") return "suspended";
    return "pending";
  }

  useEffect(() => {
    if (!token) return;

    let active = true;

    getCenters({ status: "all" }, token)
      .then((centerData) => {
        if (!active) return;
        setCenters(
          centerData.map((center) => ({
            ...center,
            status: toCenterStatus(center.status),
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

    getAllReviews(token)
      .then((reviewData) => {
        if (!active) return;
        setReviews(reviewData.map(toReview));
      })
      .catch(() => {
        if (active) setReviews([]);
      });

    return () => {
      active = false;
    };
  }, [token]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function verifyCenter(id: number) {
    if (!token) return;

    const previousCenters = centers;
    setCenters((current) =>
      current.map((center) =>
        center.id === id
          ? { ...center, status: "active", verified: true }
          : center,
      ),
    );

    try {
      await updateCenterStatus(id, "approved", token);
      showToast("Center verified and activated.");
    } catch {
      setCenters(previousCenters);
      showToast("Unable to update center status.");
    }
  }

  async function suspendCenter(id: number) {
    if (!token) return;

    const previousCenters = centers;
    setCenters((current) =>
      current.map((center) =>
        center.id === id
          ? { ...center, status: "suspended", verified: false }
          : center,
      ),
    );

    try {
      await updateCenterStatus(id, "rejected", token);
      showToast("Center suspended.");
    } catch {
      setCenters(previousCenters);
      showToast("Unable to update center status.");
    }
  }

  async function removeReview(id: number) {
    if (!token) return;

    const previousReviews = reviews;
    setReviews((current) => current.filter((review) => review.id !== id));

    try {
      await deleteReview(id, token);
      showToast("Review removed.");
    } catch {
      setReviews(previousReviews);
      showToast("Unable to remove review.");
    }
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
    () =>
      bookings
        .filter((booking) => booking.status === "confirmed")
        .reduce((sum, booking) => sum + booking.total, 0),
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
