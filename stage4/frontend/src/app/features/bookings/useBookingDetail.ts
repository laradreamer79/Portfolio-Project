import { useEffect, useState } from "react";
import { ApiError } from "../../lib/apiClient";
import {
  cancelBooking,
  getMyBookings,
  type ApiBooking,
} from "./bookingService";

export function useBookingDetail(
  token: string | null,
  routeId: string | undefined,
) {
  const [booking, setBooking] = useState<ApiBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const bookingId = Number(routeId);

  useEffect(() => {
    if (!token || !Number.isInteger(bookingId)) {
      setLoading(false);
      return;
    }

    let active = true;
    const authToken = token;
    setLoading(true);
    setError(null);

    async function loadBooking() {
      try {
        const bookings = await getMyBookings(authToken);
        if (!active) return;

        const found = bookings.find((candidate) => candidate.id === bookingId);
        setBooking(found ?? null);
        if (!found) setError("Booking not found.");
      } catch (requestError) {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load this booking.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadBooking();

    return () => {
      active = false;
    };
  }, [token, bookingId]);

  async function handleCancel() {
    if (!token || !booking || isCancelling) return;

    setIsCancelling(true);
    setCancelError(null);

    try {
      const updated = await cancelBooking(booking.id, token);
      setBooking(updated);
    } catch (requestError) {
      setCancelError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to cancel this booking.",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return {
    booking,
    cancelError,
    error,
    handleCancel,
    isCancelling,
    loading,
  };
}
