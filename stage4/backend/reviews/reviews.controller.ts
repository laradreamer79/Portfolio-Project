import {
 Controller,
 Post,
 Get,
 Body,
 Req,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service';


@Controller('reviews')
export class ReviewsController {


constructor(
 private reviewsService:ReviewsService
){}



@Post()
create(
 @Req() req,
 @Body() body
){

return this.reviewsService.create(
 req.user.id,
 body,
);

}



@Get()
findAll(){

return this.reviewsService.findAll();

}



}
