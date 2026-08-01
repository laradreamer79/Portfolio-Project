import { useEffect, useMemo, useState, type ChangeEvent, type SubmitEvent } from "react";
import type { Center } from "../../data";
import type { FieldErrors } from "../../lib/validation";
import {
  validateCenterProfile,
  validateCenterProfileImage,
} from "./centerProfileValidation";
import { getCenters, updateCenter, type UpdateCenterPayload } from "../catalog";
import {
  getCenterBookings,
  type ApiBooking,
} from "../bookings";
import { useListingManagement } from "../listing-management";

export type CenterDashboardTab =
  | "overview"
  | "bookings"
  | "trips"
  | "profile";

export type CenterBookingRow = {
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
  const [ownedCenters, setOwnedCenters] = useState<Center[]>([]);
  const [bookings, setBookings] = useState<CenterBookingRow[]>([]);
  const [selectedTripKey, setSelectedTripKey] = useState("");
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileFieldErrors, setProfileFieldErrors] = useState<
    FieldErrors<keyof UpdateCenterPayload>
  >({});
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
    const authToken = token;

    async function loadCenter() {
      try {
        const centers = await getCenters(
          { status: "all", ownerId: userId },
          authToken,
        );
        const selectedCenter = centers[0] ?? null;
        if (!selectedCenter) {
          if (active) {
            setCenter(null);
            setOwnedCenters([]);
            setBookings([]);
            setSelectedTripKey("");
          }
          return;
        }

        const centerBookings = await getCenterBookings(
          selectedCenter.id,
          authToken,
        );
        if (active) {
          setCenter(selectedCenter);
          setOwnedCenters(centers);
          setBookings(centerBookings.map(toCenterBookingRow));
          setSelectedTripKey("");
          setBookingsError(null);
        }
      } catch {
        if (active) {
          setCenter(null);
          setOwnedCenters([]);
          setBookings([]);
          setSelectedTripKey("");
          setBookingsError("Unable to load bookings. Please refresh the page.");
        }
      }
    }

    void loadCenter();

    return () => {
      active = false;
    };
  }, [token, userId]);

  const listingManagement = useListingManagement({
    token,
    defaultSlots: 8,
    onEditComplete: () => setActiveTab("trips"),
  });

  async function selectTrip(
    centerId: number,
    listingId: number,
    listingType: "trip" | "course",
  ) {
    if (!token) return;

    const selectedCenter = ownedCenters.find((item) => item.id === centerId);
    if (!selectedCenter) return;

    setCenter(selectedCenter);
    setBookings([]);
    setSelectedTripKey(`${listingType}:${listingId}:${centerId}`);
    setBookingsError(null);

    try {
      const centerBookings = await getCenterBookings(centerId, token);
      setBookings(
        centerBookings
          .map(toCenterBookingRow)
          .filter(
            (booking) =>
              booking.listingId === listingId &&
              booking.listingType === listingType,
          ),
      );
    } catch (error) {
      setBookingsError(
        error instanceof Error
          ? error.message
          : "Unable to load bookings. Please refresh the page.",
      );
    }
  }

  function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setProfileError(null);
    setProfileFieldErrors((current) => ({
      ...current,
      image: undefined,
    }));
    setProfileSuccess(null);

    if (!file) {
      setProfileImage(null);
      return;
    }

    const imageError = validateCenterProfileImage(file);
    if (imageError) {
      setProfileImage(null);
      setProfileFieldErrors((current) => ({
        ...current,
        image: imageError,
      }));
      event.target.value = "";
      return;
    }

    setProfileImage(file);
  }

  async function handleProfileSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !center) {
      setProfileError("Unable to find your center profile. Sign in again.");
      return;
    }

    const formPayload = Object.fromEntries(
      Array.from(new FormData(event.currentTarget), ([key, value]) => [
        key,
        String(value).trim() || undefined,
      ]),
    ) as UpdateCenterPayload;

    const validation = validateCenterProfile(formPayload);
    if (!validation.ok) {
      setProfileFieldErrors(validation.errors);
      return;
    }

    const payload = validation.data;
    if (profileImage) payload.image = profileImage;

    setIsSavingProfile(true);
    setProfileFieldErrors({});
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
    bookingsError,
    center,
    ownedCenters,
    handleProfileImageChange,
    handleProfileSubmit,
    isSavingProfile,
    pending,
    profileFieldErrors,
    profileError,
    profileImage,
    profileImagePreview,
    profileSuccess,
    revenue,
    setActiveTab,
    selectTrip,
    selectedTripKey,
    clearProfileFieldError: (field: keyof UpdateCenterPayload) =>
      setProfileFieldErrors((current) => ({
        ...current,
        [field]: undefined,
      })),
    ...listingManagement,
  };
}

function toCenterBookingRow(booking: ApiBooking): CenterBookingRow {
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
