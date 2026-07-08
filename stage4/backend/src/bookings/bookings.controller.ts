import { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createBooking,
  cancelBooking,
  getUserBookings,
  getAllBookings
} from "./bookings.service.js";



export async function createBookingController(
  req: AuthRequest,
  res:Response
){

  try{

    const booking =
      await createBooking({

        userId:req.user.id,

        tripId:req.body.tripId,

        courseId:req.body.courseId,

        numberOfPeople:
          req.body.numberOfPeople

      });


    res.status(201).json(booking);


  }catch(error:any){

    res.status(400).json({
      message:error.message
    });

  }

}



export async function cancelBookingController(
  req: AuthRequest,
  res:Response
){

  try{

    const booking =
      await cancelBooking(

        Number(req.params.id),

        req.user.id

      );


    res.json(booking);


  }catch(error:any){

    res.status(400).json({
      message:error.message
    });

  }

}



export async function myBookingsController(
  req: AuthRequest,
  res:Response
){

  const bookings =
    await getUserBookings(
      req.user.id
    );


  res.json(bookings);

}



export async function allBookingsController(
  req: AuthRequest,
  res:Response
){

  const bookings =
    await getAllBookings();


  res.json(bookings);

}
