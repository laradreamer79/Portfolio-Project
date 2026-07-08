import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Param,
} from '@nestjs/common';


import { ReviewsService } from './reviews.service';



@Controller('reviews')
export class ReviewsController {


  constructor(
    private readonly reviewsService: ReviewsService,
  ) {}




  // Create review
  @Post()
  async createReview(
    @Req() req,
    @Body() body,
  ){

    return this.reviewsService.createReview(
      req.user.id,
      body,
    );

  }




  // Get all reviews
  @Get()
  async getReviews(){

    return this.reviewsService.getReviews();

  }




  // Get reviews by center
  @Get('center/:id')
  async getCenterReviews(
    @Param('id') id:string,
  ){

    return this.reviewsService.getCenterReviews(
      Number(id),
    );

  }


}
