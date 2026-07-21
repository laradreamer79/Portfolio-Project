import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import type { Center } from "../../data";
import { getCenters, updateCenter, type UpdateCenterPayload } from "../catalog";
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
  const profileImagePreview = useMemo(
    () => (profileImage ? URL.createObjectURL(profileImage) : null),
    [profileImage],
  );

  useEffect(() => {
    return () => {
      if (profileImagePreview) URL.revokeObjectURL(profileImagePreview);
    };
  }, [profileImagePreview]);

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

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !center) {
      setProfileError("Unable to find your center profile. Sign in again.");
      return;
    }

    const payload = Object.fromEntries(
      Array.from(new FormData(event.currentTarget), ([key, value]) => [
        key,
        String(value).trim() || undefined,
      ]),
    ) as UpdateCenterPayload;

    if (profileImage) payload.image = profileImage;

    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const updatedCenter = await updateCenter(
        center.id,
        payload,
        token,
      );
      setCenter(updatedCenter);
      setProfileImage(null);
      setProfileSuccess("Center profile updated successfully.");
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Unable to update the center profile.",
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
    handleProfileSubmit,
    isSavingProfile,
    pending,
    profileError,
    profileImage,
    profileImagePreview,
    profileSuccess,
    revenue,
    setActiveTab,
    ...listingManagement,
  };
}
