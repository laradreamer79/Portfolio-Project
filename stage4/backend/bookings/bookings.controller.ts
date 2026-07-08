import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Req,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';


@Controller('bookings')
export class BookingsController {

  constructor(
    private readonly bookingsService: BookingsService,
  ) {}



  // Create booking
  @Post()
  async createBooking(
    @Req() req,
    @Body() body,
  ) {

    return this.bookingsService.createBooking(
      req.user.id,
      body.tripId,
      body.numberOfPeople,
    );

  }



  // Cancel booking
  @Patch(':id/cancel')
  async cancelBooking(
    @Req() req,
    @Param('id') id: string,
  ) {

    return this.bookingsService.cancelBooking(
      Number(id),
      req.user.id,
    );

  }



  // User booking history
  @Get('my')
  async getMyBookings(
    @Req() req,
  ) {

    return this.bookingsService.getUserBookings(
      req.user.id,
    );

  }



  // Admin - list all bookings
  @Get()
  async getAllBookings(){

    return this.bookingsService.getAllBookings();

  }

}
