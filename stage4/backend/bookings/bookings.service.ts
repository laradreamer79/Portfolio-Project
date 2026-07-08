import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
  ) {}


  // Create booking
  async createBooking(
    userId: number,
    tripId: number,
    numberOfPeople: number,
  ) {

    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        bookings: true,
      },
    });


    if (!trip) {
      throw new NotFoundException("Trip not found");
    }


    // prevent overbooking
    const bookedPeople = trip.bookings.reduce(
      (sum, booking) => sum + booking.numberOfPeople,
      0,
    );


    if (bookedPeople + numberOfPeople > trip.maxCapacity) {
      throw new BadRequestException(
        "Trip capacity exceeded",
      );
    }


    const booking = await this.prisma.booking.create({
      data: {
        userId,
        tripId,
        numberOfPeople,
        totalPrice:
          Number(trip.pricePerPerson) * numberOfPeople,
      },
    });


    return booking;
  }



  // Cancel booking
  async cancelBooking(
    bookingId: number,
    userId: number,
  ) {

    const booking = await this.prisma.booking.findUnique({
      where:{
        id: bookingId,
      },
    });


    if (!booking) {
      throw new NotFoundException(
        "Booking not found",
      );
    }


    if (booking.userId !== userId) {
      throw new BadRequestException(
        "Not allowed",
      );
    }


    return this.prisma.booking.update({
      where:{
        id: bookingId,
      },
      data:{
        status:"cancelled",
      },
    });
  }



  // User booking history
  async getUserBookings(userId:number){

    return this.prisma.booking.findMany({
      where:{
        userId,
      },
      include:{
        trip:true,
        course:true,
      },
      orderBy:{
        createdAt:"desc",
      },
    });

  }



  // Get all bookings
  async findAll(){

    return this.prisma.booking.findMany({
      include:{
        user:true,
        trip:true,
        course:true,
      },
    });

  }

}
