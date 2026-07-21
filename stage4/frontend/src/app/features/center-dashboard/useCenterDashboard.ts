import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import type { Center } from "../../data";
import { getCenters, updateCenter } from "../catalog";
import { useListingManagement } from "../listing-management";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export type CenterDashboardTab =
  | "overview"
  | "bookings"
  | "trips"
  | "profile";

export type CenterBookingRow = {
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

type UseCenterDashboardOptions = {
  token: string | null;
  userId?: number;
};

export function useCenterDashboard({
  token,
  userId,
}: UseCenterDashboardOptions) {
  const [activeTab, setActiveTab] =
    useState<CenterDashboardTab>("overview");
  const [center, setCenter] = useState<Center | null>(null);
  const [bookings, setBookings] = useState<CenterBookingRow[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (!token || !userId) return;

    let active = true;

    getCenters({ status: "all", ownerId: userId }, token)
      .then((centers) => {
        if (active) setCenter(centers[0] ?? null);
      })
      .catch(() => {
        if (active) setCenter(null);
      });

    return () => {
      active = false;
    };
  }, [token, userId]);

  const listingManagement = useListingManagement({
    token,
    defaultSlots: 8,
    onEditComplete: () => setActiveTab("trips"),
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

  function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setProfileError(null);
    setProfileSuccess(null);

    if (!file) {
      setProfileImage(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setProfileImage(null);
      setProfileError("Upload a JPEG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setProfileImage(null);
      setProfileError("The center image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setProfileImage(file);
  }

  async function handleProfileImageSubmit() {
    if (!token || !center) {
      setProfileError("Unable to find your center profile. Sign in again.");
      return;
    }

    if (!profileImage) {
      setProfileError("Select a center image before uploading.");
      return;
    }

    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const updatedCenter = await updateCenter(
        center.id,
        { image: profileImage },
        token,
      );
      setCenter(updatedCenter);
      setProfileImage(null);
      setProfileSuccess("Center image updated successfully.");
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Unable to update the center image.",
      );
    } finally {
      setIsSavingProfile(false);
    }
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
    center,
    confirmBooking,
    declineBooking,
    handleProfileImageChange,
    handleProfileImageSubmit,
    isSavingProfile,
    pending,
    profileError,
    profileImage,
    profileSuccess,
    revenue,
    setActiveTab,
    ...listingManagement,
  };
}
