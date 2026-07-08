import { prisma } from "../prisma/client.js";


interface CreateBookingInput {
  userId: number;
  tripId?: number;
  courseId?: number;
  numberOfPeople: number;
}


export async function createBooking(
  data: CreateBookingInput
) {

  if (!data.tripId && !data.courseId) {
    throw new Error(
      "Booking must have a trip or course"
    );
  }


  let totalPrice = 0;


  if (data.tripId) {

    const trip = await prisma.trip.findUnique({
      where:{
        id:data.tripId
      },
      include:{
        bookings:true
      }
    });


    if(!trip){
      throw new Error("Trip not found");
    }


    const bookedPeople =
      trip.bookings
      .filter(
        booking =>
          booking.status !== "cancelled"
      )
      .reduce(
        (sum, booking)=>
          sum + booking.numberOfPeople,
        0
      );


    if(
      bookedPeople + data.numberOfPeople
      >
      trip.maxCapacity
    ){
      throw new Error(
        "No available seats"
      );
    }


    totalPrice =
      Number(trip.pricePerPerson)
      *
      data.numberOfPeople;
  }



  if(data.courseId){

    const course =
      await prisma.course.findUnique({
        where:{
          id:data.courseId
        }
      });


    if(!course){
      throw new Error(
        "Course not found"
      );
    }


    totalPrice =
      Number(course.price)
      *
      data.numberOfPeople;
  }



  return prisma.booking.create({

    data:{
      userId:data.userId,
      tripId:data.tripId,
      courseId:data.courseId,
      numberOfPeople:data.numberOfPeople,
      totalPrice,
    },

    include:{
      trip:true,
      course:true
    }

  });

}



export async function cancelBooking(
  bookingId:number,
  userId:number
){

  const booking =
    await prisma.booking.findUnique({
      where:{
        id:bookingId
      }
    });


  if(!booking){
    throw new Error(
      "Booking not found"
    );
  }


  if(
    booking.userId !== userId
  ){
    throw new Error(
      "Not allowed"
    );
  }


  return prisma.booking.update({

    where:{
      id:bookingId
    },

    data:{
      status:"cancelled"
    }

  });

}



export async function getUserBookings(
  userId:number
){

  return prisma.booking.findMany({

    where:{
      userId
    },

    include:{
      trip:{
        include:{
          center:true
        }
      },

      course:{
        include:{
          center:true
        }
      }

    },

    orderBy:{
      createdAt:"desc"
    }

  });

}



export async function getAllBookings(){

  return prisma.booking.findMany({

    include:{
      user:true,
      trip:true,
      course:true,
      payment:true
    },

    orderBy:{
      createdAt:"desc"
    }

  });

}
