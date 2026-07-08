export class BookingEntity {
  id: number;

  numberOfPeople: number;

  totalPrice: number;

  status: string;

  createdAt: Date;

  updatedAt: Date;

  userId: number;

  tripId?: number;

  courseId?: number;
}
