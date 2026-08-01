import { useEffect, useMemo, useState } from "react";
import { ZodError } from "zod";
import type { Center } from "../../data";
import { ApiError } from "../../lib/apiClient";
import {
  cancelBooking,
  getAllBookings,
  type BookingCard,
} from "../bookings";
import { getCenters, updateCenterStatus } from "../catalog";
import { deleteReview, getAllReviews, toReview } from "../reviews";
import {
  getAdminDashboard,
  getAdminInstructors,
  getAdminProfile,
  updateAdminInstructorStatus,
  updateAdminProfile,
  type AdminInstructor,
  type AdminDashboardSummary,
  type AdminProfile,
} from "./adminService";
import type { UpdateAdminProfileInput } from "./adminValidation";

export type AdminTab =
  | "overview"
  | "centers"
  | "instructors"
  | "bookings"
  | "reviews"
  | "profile";
export type CenterStatus = "active" | "pending" | "suspended";
export type InstructorStatus = "pending" | "approved" | "rejected";

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
  { key: "instructors", label: "Instructors" },
  { key: "bookings", label: "Bookings" },
  { key: "reviews", label: "Reviews" },
  { key: "profile", label: "Profile" },
];

export function useAdminDashboard(token: string | null) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [dashboard, setDashboard] =
    useState<AdminDashboardSummary | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [centers, setCenters] = useState<CenterRow[]>([]);
  const [instructors, setInstructors] = useState<AdminInstructor[]>([]);
  const [bookings, setBookings] = useState<BookingCard[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [centerQuery, setCenterQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CenterStatus | "all">("all");
  const [instructorQuery, setInstructorQuery] = useState("");
  const [instructorStatusFilter, setInstructorStatusFilter] =
    useState<InstructorStatus | "all">("all");
  const [toast, setToast] = useState<string | null>(null);

  function toCenterStatus(status?: string): CenterStatus {
    if (status === "approved") return "active";
    if (status === "rejected") return "suspended";
    return "pending";
  }

  useEffect(() => {
    if (!token) return;

    let active = true;
    const authToken = token;

    async function loadDashboardSummary() {
      try {
        const summary = await getAdminDashboard(authToken);
        if (active) setDashboard(summary);
      } catch {
        if (active) setDashboard(null);
      }
    }

    async function loadAdminProfile() {
      try {
        const adminProfile = await getAdminProfile(authToken);
        if (active) setProfile(adminProfile);
      } catch {
        if (active) {
          setProfile(null);
          setProfileError("Unable to load the admin profile.");
        }
      }
    }

    async function loadCenters() {
      try {
        const centerData = await getCenters(
          { status: "all" },
          authToken,
        );
        if (!active) return;
        setCenters(
          centerData.map((center) => ({
            ...center,
            status: toCenterStatus(center.status),
          })),
        );
      } catch {
        if (active) setCenters([]);
      }
    }

    async function loadInstructors() {
      try {
        const instructorData = await getAdminInstructors(authToken);
        if (active) setInstructors(instructorData);
      } catch {
        if (active) setInstructors([]);
      }
    }

    async function loadBookings() {
      try {
        const bookingData = await getAllBookings(authToken);
        if (active) setBookings(bookingData);
      } catch {
        if (active) setBookings([]);
      }
    }

    async function loadReviews() {
      try {
        const reviewData = await getAllReviews(authToken);
        if (!active) return;
        setReviews(reviewData.map(toReview));
      } catch {
        if (active) setReviews([]);
      }
    }

    void loadDashboardSummary();
    void loadAdminProfile();
    void loadCenters();
    void loadInstructors();
    void loadBookings();
    void loadReviews();

    return () => {
      active = false;
    };
  }, [token]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  async function refreshDashboard() {
    if (!token) return;

    try {
      setDashboard(await getAdminDashboard(token));
    } catch {
      // Existing table data remains usable if the summary request fails.
    }
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
      await refreshDashboard();
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
      await refreshDashboard();
      showToast("Center suspended.");
    } catch {
      setCenters(previousCenters);
      showToast("Unable to update center status.");
    }
  }

  async function setInstructorStatus(
    id: number,
    status: InstructorStatus,
  ) {
    if (!token) return;

    const previousInstructors = instructors;
    setInstructors((current) =>
      current.map((instructor) =>
        instructor.id === id ? { ...instructor, status } : instructor,
      ),
    );

    try {
      await updateAdminInstructorStatus(id, status, token);
      await refreshDashboard();
      showToast(
        status === "approved"
          ? "Instructor approved and activated."
          : status === "rejected"
            ? "Instructor access rejected."
            : "Instructor moved back to pending review.",
      );
    } catch {
      setInstructors(previousInstructors);
      showToast("Unable to update instructor status.");
    }
  }

  async function removeReview(id: number) {
    if (!token) return;

    const previousReviews = reviews;
    setReviews((current) => current.filter((review) => review.id !== id));

    try {
      await deleteReview(id, token);
      await refreshDashboard();
      showToast("Review removed.");
    } catch {
      setReviews(previousReviews);
      showToast("Unable to remove review.");
    }
  }

  async function cancelAdminBooking(id: number) {
    if (!token) return;

    const previousBookings = bookings;
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id
          ? { ...booking, status: "cancelled" }
          : booking,
      ),
    );

    try {
      await cancelBooking(id, token);
      await refreshDashboard();
      showToast("Booking cancelled.");
    } catch {
      setBookings(previousBookings);
      showToast("Unable to cancel booking.");
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

  const filteredInstructors = useMemo(() => {
    const normalizedQuery = instructorQuery.trim().toLowerCase();

    return instructors.filter((instructor) => {
      const matchesQuery =
        !normalizedQuery ||
        instructor.user.name.toLowerCase().includes(normalizedQuery) ||
        instructor.user.email.toLowerCase().includes(normalizedQuery) ||
        instructor.licenseNumber.toLowerCase().includes(normalizedQuery) ||
        instructor.city?.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        instructorStatusFilter === "all" ||
        instructor.status === instructorStatusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [instructorQuery, instructors, instructorStatusFilter]);

  const totalRevenue = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === "confirmed")
        .reduce((sum, booking) => sum + booking.total, 0),
    [bookings],
  );
  const pendingCount = useMemo(
    () =>
      dashboard?.pendingCenters ??
      centers.filter((center) => center.status === "pending").length,
    [centers, dashboard],
  );
  const pendingInstructorCount = useMemo(
    () =>
      dashboard?.pendingInstructors ??
      instructors.filter((instructor) => instructor.status === "pending").length,
    [dashboard, instructors],
  );

  async function saveProfile(data: UpdateAdminProfileInput) {
    if (!token) return;

    setIsSavingProfile(true);
    setProfileError(null);

    try {
      const updatedProfile = await updateAdminProfile(data, token);
      setProfile(updatedProfile);
      showToast("Profile updated.");
    } catch (error) {
      const message =
        error instanceof ZodError
          ? error.issues[0]?.message
          : error instanceof ApiError
            ? error.message
            : "Unable to update the profile.";
      setProfileError(message ?? "Unable to update the profile.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  return {
    activeTab,
    bookings,
    cancelAdminBooking,
    centerQuery,
    centers,
    dashboard,
    filteredCenters,
    filteredInstructors,
    instructorQuery,
    instructors,
    instructorStatusFilter,
    isSavingProfile,
    pendingCount,
    pendingInstructorCount,
    profile,
    profileError,
    removeReview,
    reviews,
    saveProfile,
    setActiveTab,
    setCenterQuery,
    setInstructorQuery,
    setInstructorStatus,
    setInstructorStatusFilter,
    setStatusFilter,
    statusFilter,
    suspendCenter,
    toast,
    totalRevenue,
    verifyCenter,
  };
}
