import { Request, Response } from "express";
import * as bookingService from "./bookings.service";


// Create booking
export async function createBooking(req: Request, res: Response) {
  try {
    const booking = await bookingService.createBooking(req.body);

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}


// Get booking by ID
export async function getBookingById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const booking = await bookingService.getBookingById(id);

    return res.status(200).json(booking);
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
}


// Get logged-in user's bookings
export async function getUserBookings(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);

    const bookings = await bookingService.getUserBookings(userId);

    return res.status(200).json(bookings);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}


// Get all bookings (Admin)
export async function getAllBookings(req: Request, res: Response) {
  try {
    const bookings = await bookingService.getAllBookings();

    return res.status(200).json(bookings);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}


// Update booking status
export async function updateBookingStatus(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const booking = await bookingService.updateBookingStatus(
      id,
      req.body.status,
    );

    return res.status(200).json({
      message: "Booking status updated",
      booking,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}


// Cancel booking
export async function cancelBooking(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const booking = await bookingService.cancelBooking(id);

    return res.status(200).json({
      message: "Booking cancelled",
      booking,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}


// Delete booking
export async function deleteBooking(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await bookingService.deleteBooking(id);

    return res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}
