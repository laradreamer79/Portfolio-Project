import { useEffect, useMemo, useState } from "react";
import { ApiError } from "../../lib/apiClient";
import {
  cancelBooking,
  getMyBookings,
  type ApiBooking,
} from "./bookingService";

export function useMyBookings(token: string | null) {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    getMyBookings(token)
      .then((data) => {
        if (active) setBookings(data);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load your bookings.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function handleCancel(bookingId: number) {
    if (!token || cancellingId !== null) return;

    setCancellingId(bookingId);
    setCancelError(null);

    try {
      const updated = await cancelBooking(bookingId, token);
      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? { ...booking, ...updated }
            : booking,
        ),
      );
    } catch (requestError) {
      setCancelError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to cancel this booking. Please try again.",
      );
    } finally {
      setCancellingId(null);
    }
  }

  const activeCount = useMemo(
    () =>
      bookings.filter((booking) => booking.status !== "cancelled").length,
    [bookings],
  );
  const cancelledCount = useMemo(
    () =>
      bookings.filter((booking) => booking.status === "cancelled").length,
    [bookings],
  );

  return {
    activeCount,
    bookings,
    cancelledCount,
    cancellingId,
    cancelError,
    error,
    handleCancel,
    loading,
  };
}
