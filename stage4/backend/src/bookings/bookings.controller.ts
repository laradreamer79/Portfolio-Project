export async function cancelBookingController(
  req: AuthRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const bookingId = Number(req.params.id);

    const booking = await cancelBooking(
      bookingId,
      req.user.id,
    );

    return res.status(200).json(booking);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "BOOKING_NOT_FOUND") {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      if (error.message === "FORBIDDEN") {
        return res.status(403).json({
          message: "You are not allowed to cancel this booking",
        });
      }

      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
}
