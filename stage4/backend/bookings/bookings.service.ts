import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}


  // Create booking for trip
  async createBooking(
    userId: number,
    tripId: number,
    numberOfPeople: number,
  ) {

    const trip = await this.prisma.trip.findUnique({
      where: {
        id: tripId,
      },
      include: {
        bookings: true,
      },
    });


    if (!trip) {
      throw new NotFoundException(
        'Trip not found',
      );
    }


    const currentBookings =
      trip.bookings
        .filter(
          booking => booking.status !== 'cancelled',
        )
        .reduce(
          (total, booking) =>
            total + booking.numberOfPeople,
          0,
        );


    // Prevent overbooking
    if (
      currentBookings + numberOfPeople >
      trip.maxCapacity
    ) {
      throw new BadRequestException(
        'Not enough available seats',
      );
    }


    return this.prisma.booking.create({
      data: {
        userId,
        tripId,
        numberOfPeople,
        totalPrice:
          Number(trip.pricePerPerson) *
          numberOfPeople,
      },
      include: {
        trip: true,
      },
    });
  }



  // Cancel booking
  async cancelBooking(
    bookingId: number,
    userId: number,
  ) {

    const booking =
      await this.prisma.booking.findUnique({
        where:{
          id: bookingId,
        },
      });


    if (!booking) {
      throw new NotFoundException(
        'Booking not found',
      );
    }


    if (booking.userId !== userId) {
      throw new BadRequestException(
        'You cannot cancel this booking',
      );
    }


    return this.prisma.booking.update({
      where:{
        id: bookingId,
      },
      data:{
        status:'cancelled',
      },
    });
  }



  // User booking history
  async getUserBookings(
    userId:number,
  ){

    return this.prisma.booking.findMany({

      where:{
        userId,
      },

      include:{
        trip:{
          include:{
            center:true,
          },
        },

        course:{
          include:{
            center:true,
          },
        },

      },

      orderBy:{
        createdAt:'desc',
      },

    });
  }


  // Admin list all bookings
  async getAllBookings(){

    return this.prisma.booking.findMany({

      include:{
        user:true,
        trip:true,
        course:true,
      },

      orderBy:{
        createdAt:'desc',
      },

    });

  }

}
