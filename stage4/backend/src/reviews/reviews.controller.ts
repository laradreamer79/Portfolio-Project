import { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  createReview,
  getReviews
} from "./reviews.service.js";



export async function createReviewController(
  req: AuthRequest,
  res:Response
){

  try{

    const review =
      await createReview(
        req.user.id,
        req.body
      );


    res.status(201).json(review);


  }catch(error:any){

    res.status(400).json({
      message:error.message
    });

  }

}



export async function getReviewsController(
  req: AuthRequest,
  res:Response
){

  const reviews =
    await getReviews();


  res.json(reviews);

}
