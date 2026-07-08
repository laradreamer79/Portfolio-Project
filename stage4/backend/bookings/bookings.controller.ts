import {
 Controller,
 Post,
 Get,
 Patch,
 Param,
 Body,
 Req,
 UseGuards,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';


@Controller('bookings')
export class BookingsController {


constructor(
 private bookingsService: BookingsService
){}



@Post()
async create(
 @Req() req,
 @Body() body
){

 return this.bookingsService.createBooking(
   req.user.id,
   body.tripId,
   body.numberOfPeople,
 );

}



@Patch(':id/cancel')
async cancel(
 @Param('id') id:number,
 @Req() req
){

 return this.bookingsService.cancelBooking(
   Number(id),
   req.user.id,
 );

}



@Get('history')
async history(
 @Req() req
){

 return this.bookingsService.getUserBookings(
   req.user.id,
 );

}



@Get()
async findAll(){

 return this.bookingsService.findAll();

}


}
