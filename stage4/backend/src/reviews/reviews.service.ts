import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';


@Injectable()
export class ReviewsService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}



  // Create review
  async createReview(
    userId: number,
    data: {
      centerId: number;
      tripId?: number;
      courseId?: number;
      rating: number;
      comment?: string;
    },
  ) {


    if (
      data.rating < 1 ||
      data.rating > 5
    ) {
      throw new BadRequestException(
        'Rating must be between 1 and 5',
      );
    }



    return this.prisma.review.create({

      data: {

        userId,

        centerId: data.centerId,

        tripId: data.tripId,

        courseId: data.courseId,

        rating: data.rating,

        comment: data.comment,

      },

      include: {
        user: true,
        center: true,
        trip: true,
        course: true,
      },

    });

  }




  // Get all reviews
  async getReviews(){

    return this.prisma.review.findMany({

      include: {

        user: true,

        center: true,

        trip: true,

        course: true,

      },

      orderBy: {

        createdAt: 'desc',

      },

    });

  }



  // Get reviews by center
  async getCenterReviews(
    centerId:number,
  ){

    const reviews =
      await this.prisma.review.findMany({

        where:{
          centerId,
        },

        include:{
          user:true,
          trip:true,
          course:true,
        },

      });


    if(!reviews){

      throw new NotFoundException(
        'No reviews found',
      );

    }


    return reviews;

  }

}
